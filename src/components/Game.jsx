/* eslint-disable react/prop-types */
import './Game.css'
import { useState, useEffect } from 'react'

import { GameHeader } from './GameHeader'
import { Statistics } from './Statistics'
import toast from 'react-hot-toast';
import { FaLightbulb } from 'react-icons/fa';

export function Game({ moviesData, onBackToMenu }) {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(() => {
    return parseInt(localStorage.getItem('currentMovieIndex')) || 0
  })
  const [currentHintIndex, setCurrentHintIndex] = useState(() => {
    return parseInt(localStorage.getItem('currentHintIndex')) || 0
  })
  const [score, setScore] = useState(() => {
    return parseInt(localStorage.getItem('currentScore')) || 0
  })
  const [lives, setLives] = useState(() => {
    return parseInt(localStorage.getItem('currentLives')) || 10
  })
  const [guess, setGuess] = useState('')
  const [congratulationsMessage, setCongratulationsMessage] = useState('')
  const [lossMessage, setLossMessage] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [hasGuessed, setHasGuessed] = useState(false)
  const [showGuessBox, setShowGuessBox] = useState(true)
  const [showHints, setShowHints] = useState(true)
  const [showStatistics, setShowStatistics] = useState(false)
  const [isVictory, setIsVictory] = useState(false)

  const currentMovie = moviesData[currentMovieIndex]
  const totalHints = currentMovie.hints.length
  const remainingHints = totalHints - currentHintIndex - 1

  useEffect(() => {
    localStorage.setItem('currentMovieIndex', currentMovieIndex)
    localStorage.setItem('currentHintIndex', currentHintIndex)
    localStorage.setItem('currentScore', score)
    localStorage.setItem('currentLives', lives)
  }, [currentMovieIndex, currentHintIndex, score, lives])

  const saveStatistics = (victory) => {
    const stats = JSON.parse(localStorage.getItem('movieGameStats') || '{}')
    const newStats = {
      highScore: Math.max(stats.highScore || 0, score),
      gamesPlayed: (stats.gamesPlayed || 0) + 1,
      gamesWon: (stats.gamesWon || 0) + (victory ? 1 : 0),
      totalScore: (stats.totalScore || 0) + score
    }
    localStorage.setItem('movieGameStats', JSON.stringify(newStats))
  }

  const handleGuess = (userGuess) => {
    console.log('Handling guess:', userGuess);
    if (!hasGuessed) {
      if (!userGuess.trim()) {
        toast.error('Por favor, insira uma resposta!');
        return;
      }

      const cleanUserGuess = userGuess.trim().toLowerCase().replace(/[^\w\s]/gi, '');
      const cleanMovieTitle = currentMovie.title.trim().toLowerCase().replace(/[^\w\s]/gi, '');

      if (cleanUserGuess === cleanMovieTitle) {
        const pointsEarned = 500 - currentHintIndex * 100;
        setScore(score + pointsEarned);

        if (currentMovieIndex < moviesData.length - 1) {
          toast.success(`Parabéns! ${pointsEarned} pontos adicionados!`);
          setTimeout(() => {
            setCurrentMovieIndex(currentMovieIndex + 1);
            setCurrentHintIndex(0);
            setHasGuessed(false);
            setShowGuessBox(true);
            setShowHints(true);
            setGuess('');
          }, 500);
        } else {
          setCongratulationsMessage('Você finalizou o jogo!');
          saveStatistics(true);
          setIsVictory(true);
          setShowStatistics(true);
        }
      } else {
        setLives(lives - 1);

        if (lives === 1) {
          toast.error('Você perdeu todas as vidas!')
          setShowOptions(true);
        } else {
          toast.error('Você perdeu uma vida! Tente novamente');
          setShowOptions(true);
        }

        setGuess('');
        setHasGuessed(true);
        setShowGuessBox(false);
        setShowHints(false);
      }
    }
  };

  const handleOptionClick = (option) => {
    console.log('Option clicked:', option)

    setShowOptions(false)

    if (option === 'retry') {
      setShowGuessBox(true)
      setCurrentHintIndex(currentHintIndex + 1)
      setHasGuessed(false)
      setShowHints(true)
    } else if (option === 'changeMovie') {
      setCurrentMovieIndex(currentMovieIndex + 1)

      if (currentMovieIndex + 1 < moviesData.length) {
        setShowGuessBox(true)
        setCurrentHintIndex(0)
        setHasGuessed(false)
        setShowHints(true)
      } else {
        setCongratulationsMessage('Parabéns! Você finalizou o jogo!')
        saveStatistics(true);
        setIsVictory(true);
        setShowStatistics(true);
      }
    }
  }

  const clearProgress = () => {
    localStorage.removeItem('currentMovieIndex')
    localStorage.removeItem('currentHintIndex')
    localStorage.removeItem('currentScore')
    localStorage.removeItem('currentLives')
  }

  const handleRestart = () => {
    clearProgress()
    setCurrentMovieIndex(0)
    setCurrentHintIndex(0)
    setScore(0)
    setLives(10)
    setGuess('')
    setCongratulationsMessage('')
    setLossMessage('')
    setShowOptions(false)
    setHasGuessed(false)
    setShowGuessBox(true)
    setShowHints(true)
  }

  const handleGuessChange = (event) => {
    setGuess(event.target.value)
  }

  const handleGuessSubmit = (event) => {
    event.preventDefault()
    handleGuess(guess)
  }

  useEffect(() => {
    console.log('Effect triggered. Lives:', lives)

    if (lives === 0 && !congratulationsMessage) {
      setLossMessage('Game Over!')
      saveStatistics(false)
      setShowStatistics(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lives, congratulationsMessage])

  const handleBackToMenu = () => {
    clearProgress()
    onBackToMenu()
  }

  return (
    <>
      {showStatistics ? (
        <Statistics
          currentScore={score}
          onRestart={handleRestart}
          onBackToMenu={handleBackToMenu}
          isVictory={isVictory}
        />
      ) : lives > 0 ? (
        <>
          {!showOptions ? (
            <div className='start-game'>
              <GameHeader score={score} lives={lives} remainingHints={remainingHints} />

              {currentMovie.hints.length > 0 && currentHintIndex < currentMovie.hints.length &&
                <p className='hints_control'><FaLightbulb className="bulb-hint" />{currentMovie.hints[currentHintIndex]}</p>
              }

              {congratulationsMessage && <p>{congratulationsMessage}</p>}
              {lossMessage && <p>{lossMessage}</p>}

              {showGuessBox && (
                <form onSubmit={handleGuessSubmit}>
                  <label>
                    <p className='guess_text'>Acerte o filme: </p>
                    <input className='guess_box' type="text" value={guess} onChange={handleGuessChange} placeholder="Digite seu palpite..." />
                  </label>
                  <p>
                    <button type="submit">Enviar</button>
                  </p>
                </form>
              )}

              {showHints && (
                <div>
                  <h3>Dicas:</h3>
                  <ol className='hints_box'>
                    {currentMovie.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ) : !congratulationsMessage && (
            <div className='options-container'>
              <p>Que pena, você perdeu uma vida!</p>
              <p>Quer mais uma dica ou quer mudar de filme?</p>
              <p>
                <button style={{width: '220px'}} onClick={() => handleOptionClick('retry')}>Continuar</button>
              </p>
              <p>
                <button style={{width: '220px'}} onClick={() => handleOptionClick('changeMovie')}>Mudar filme</button>
              </p>
            </div>
          )}
        </>
      ) : null}
    </>
  )
}
