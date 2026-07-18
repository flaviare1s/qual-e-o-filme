/* eslint-disable react/prop-types */
import './Game.css'
import { useState, useEffect, useRef } from 'react'

import { GameHeader } from './GameHeader'
import { Statistics } from './Statistics'
import toast from 'react-hot-toast';
import { FaLightbulb } from 'react-icons/fa';
import {
  isMuted,
  setMuted as setSoundMuted,
  playCorrect,
  playWrong,
  playClick,
} from '../utils/sound'
import { useTranslation } from '../i18n/context'

export function Game({ moviesData, onBackToMenu }) {
  const { t } = useTranslation()
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
  const [outcome, setOutcome] = useState(null) // 'win' | 'lose' | 'finish'
  const [showOptions, setShowOptions] = useState(false)
  const [hasGuessed, setHasGuessed] = useState(false)
  const [showGuessBox, setShowGuessBox] = useState(true)
  const [showHints, setShowHints] = useState(true)
  const [showStatistics, setShowStatistics] = useState(false)
  const [muted, setMuted] = useState(isMuted())

  const optionsRef = useRef(null)

  const currentMovie = moviesData[currentMovieIndex]
  const totalHints = currentMovie.hints.length
  const remainingHints = totalHints - currentHintIndex - 1

  useEffect(() => {
    localStorage.setItem('currentMovieIndex', currentMovieIndex)
    localStorage.setItem('currentHintIndex', currentHintIndex)
    localStorage.setItem('currentScore', score)
    localStorage.setItem('currentLives', lives)
  }, [currentMovieIndex, currentHintIndex, score, lives])

  // Move o foco para o painel de opções quando ele aparece.
  useEffect(() => {
    if (showOptions) optionsRef.current?.focus()
  }, [showOptions])

  const toggleMute = () => {
    const next = !muted
    setSoundMuted(next)
    setMuted(next)
    playClick() // toca só ao reativar o som (silenciado, retorna cedo)
  }

  // finalScore explícito evita ler o `score` desatualizado do closure na
  // vitória do último filme (o setScore ainda não refletiu no fechamento).
  const saveStatistics = (victory, finalScore = score) => {
    const stats = JSON.parse(localStorage.getItem('movieGameStats') || '{}')
    const newStats = {
      highScore: Math.max(stats.highScore || 0, finalScore),
      gamesPlayed: (stats.gamesPlayed || 0) + 1,
      gamesWon: (stats.gamesWon || 0) + (victory ? 1 : 0),
      totalScore: (stats.totalScore || 0) + finalScore
    }
    localStorage.setItem('movieGameStats', JSON.stringify(newStats))
  }

  const handleGuess = (userGuess) => {
    if (hasGuessed) return

    if (!userGuess.trim()) {
      toast.error(t('game.emptyGuess'));
      return;
    }

    const cleanUserGuess = userGuess.trim().toLowerCase().replace(/[^\w\s]/gi, '');
    const cleanMovieTitle = currentMovie.title.trim().toLowerCase().replace(/[^\w\s]/gi, '');

    if (cleanUserGuess === cleanMovieTitle) {
      // Piso de 100: acertar nunca pode reduzir a pontuação, mesmo depois de
      // esgotar as dicas (currentHintIndex >= 5 tornaria 500 - n*100 <= 0).
      const pointsEarned = Math.max(500 - currentHintIndex * 100, 100);
      const newScore = score + pointsEarned;
      setScore(newScore);

      const isLastMovie = currentMovieIndex >= moviesData.length - 1;

      if (!isLastMovie) {
        playCorrect();
        toast.success(t('game.correct', { points: pointsEarned }));
        setTimeout(() => {
          setCurrentMovieIndex(currentMovieIndex + 1);
          setCurrentHintIndex(0);
          setHasGuessed(false);
          setShowGuessBox(true);
          setShowHints(true);
          setGuess('');
        }, 700);
      } else {
        // Vitória: só acertar o último filme conta como vitória.
        setOutcome('win');
        saveStatistics(true, newScore);
        setShowStatistics(true);
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      playWrong();

      if (newLives === 0) {
        toast.error(t('game.lostAll'));
      } else {
        toast.error(t('game.lostLife'));
        setShowOptions(true);
      }

      setGuess('');
      setHasGuessed(true);
      setShowGuessBox(false);
      setShowHints(false);
    }
  };

  const handleOptionClick = (option) => {
    playClick();
    setShowOptions(false);

    if (option === 'retry') {
      setShowGuessBox(true);
      setCurrentHintIndex(currentHintIndex + 1);
      setHasGuessed(false);
      setShowHints(true);
    } else if (option === 'changeMovie') {
      const isLastMovie = currentMovieIndex >= moviesData.length - 1;

      if (!isLastMovie) {
        setCurrentMovieIndex(currentMovieIndex + 1);
        setShowGuessBox(true);
        setCurrentHintIndex(0);
        setHasGuessed(false);
        setShowHints(true);
      } else {
        // Pulou o último filme: jogo terminado, mas NÃO é vitória.
        setOutcome('finish');
        saveStatistics(false);
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
    setOutcome(null)
    setShowOptions(false)
    setHasGuessed(false)
    setShowGuessBox(true)
    setShowHints(true)
    setShowStatistics(false)
  }

  const handleGuessChange = (event) => {
    setGuess(event.target.value)
  }

  const handleGuessSubmit = (event) => {
    event.preventDefault()
    handleGuess(guess)
  }

  useEffect(() => {
    if (lives === 0 && !outcome) {
      setOutcome('lose')
      saveStatistics(false)
      setShowStatistics(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lives, outcome])

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
          outcome={outcome}
        />
      ) : lives > 0 ? (
        <>
          {!showOptions ? (
            <div className='start-game'>
              <GameHeader
                score={score}
                lives={lives}
                remainingHints={remainingHints}
                muted={muted}
                onToggleMute={toggleMute}
              />

              {currentMovie.hints.length > 0 && currentHintIndex < currentMovie.hints.length ? (
                <p className='hints_control' key={currentHintIndex} aria-live='polite'>
                  <FaLightbulb className="bulb-hint" aria-hidden='true' />{currentMovie.hints[currentHintIndex]}
                </p>
              ) : currentHintIndex >= currentMovie.hints.length && (
                <p className='no-hints' aria-live='polite'>
                  {t('game.noHints')}
                </p>
              )}

              {showGuessBox && (
                <form onSubmit={handleGuessSubmit}>
                  <label htmlFor='guess-input'>
                    <p className='guess_text'>{t('game.prompt')}</p>
                  </label>
                  <input
                    id='guess-input'
                    className='guess_box'
                    type="text"
                    value={guess}
                    onChange={handleGuessChange}
                    placeholder={t('game.placeholder')}
                    autoComplete='off'
                    autoFocus
                  />
                  <p>
                    <button type="submit">{t('game.submit')}</button>
                  </p>
                </form>
              )}

              {showHints && currentHintIndex > 0 && (
                <div>
                    <h3 className='previous_hints'>{t('game.previousHints')}</h3>
                  <ol className='hints_box'>
                    {currentMovie.hints.slice(0, currentHintIndex).map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ) : !outcome && (
            <div className='options-container' ref={optionsRef} tabIndex={-1} role='group' aria-label={t('game.optionsAria')}>
              <p>{t('game.optionsLostLife')}</p>
              <p>{t('game.optionsQuestion')}</p>
              <p>
                <button style={{ width: '220px' }} onClick={() => handleOptionClick('retry')}>{t('game.retry')}</button>
              </p>
              <p>
                <button style={{ width: '220px' }} onClick={() => handleOptionClick('changeMovie')}>{t('game.changeMovie')}</button>
              </p>
            </div>
          )}
        </>
      ) : null}
    </>
  )
}
