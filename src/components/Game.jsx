/* eslint-disable react/prop-types */
import './Game.css'
import { useState, useEffect } from 'react'

import { GameOver } from './GameOver'
import { GameHeader } from './GameHeader'
import toast from 'react-hot-toast';
import { FaLightbulb } from 'react-icons/fa';

export function Game({ moviesData }) {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(10)
  const [guess, setGuess] = useState('')
  const [congratulationsMessage, setCongratulationsMessage] = useState('')
  const [lossMessage, setLossMessage] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [hasGuessed, setHasGuessed] = useState(false)
  const [showGuessBox, setShowGuessBox] = useState(true)
  const [showHints, setShowHints] = useState(true)

  const currentMovie = moviesData[currentMovieIndex]
  const totalHints = currentMovie.hints.length
  const remainingHints = totalHints - currentHintIndex - 1

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
          setShowOptions(true);
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
        setShowOptions(true)
      }
    }
  }

  const handleRestart = () => {
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
      setShowOptions(true)
    }
  }, [lives, congratulationsMessage])

  return (
    <>
      {lives > 0 ? (
        <>
          {!showOptions ? (
            <div className='start-game'>
              <GameHeader score={score} lives={lives} remainingHints={remainingHints} />

              <p className='hints_control'><FaLightbulb className="bulb-hint" />{currentMovie.hints[currentHintIndex]}</p>

              {congratulationsMessage && <p>{congratulationsMessage}</p>}
              {lossMessage && <p>{lossMessage}</p>}

              {showGuessBox && (
                <form onSubmit={handleGuessSubmit}>
                  <label>
                    <p className='guess_text'>Acerte o filme: </p>
                    <input className='guess_box' type="text" value={guess} onChange={handleGuessChange} placeholder="Digite sua resposta..." />
                  </label>
                  <p>
                    <button type="submit">Palpite</button>
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
              <p>Você quer mais uma dica ou quer mudar de filme?</p>
              <p>
                <button onClick={() => handleOptionClick('retry')}>Continuar</button>
              </p>
              <p>
                <button onClick={() => handleOptionClick('changeMovie')}>Mudar filme</button>
              </p>
            </div>
          )}
        </>
      ) : (
        <GameOver onRestart={handleRestart} />
      )}
    </>
  )
}
