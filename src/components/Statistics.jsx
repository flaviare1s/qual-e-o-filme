/* eslint-disable react/prop-types */
import './Statistics.css'
import { useEffect, useRef } from 'react'
import { playWin, playLose, playFinish } from '../utils/sound'
import { useTranslation } from '../i18n/context'

export function Statistics({ currentScore, onRestart, onBackToMenu, outcome = 'finish' }) {
  const { t } = useTranslation()
  const headingRef = useRef(null)
  const { emoji, title, message } = t(`stats.outcomes.${outcome}`) || t('stats.outcomes.finish')

  const stats = JSON.parse(localStorage.getItem('movieGameStats') || '{}')
  const highScore = stats.highScore || 0
  const gamesPlayed = stats.gamesPlayed || 0
  const gamesWon = stats.gamesWon || 0
  const totalScore = stats.totalScore || 0

  const averageScore = gamesPlayed > 0 ? Math.round(totalScore / gamesPlayed) : 0
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0

  useEffect(() => {
    if (outcome === 'win') playWin()
    else if (outcome === 'lose') playLose()
    else playFinish()
    headingRef.current?.focus()
  }, [outcome])

  const statItems = [
    { label: t('stats.current'), value: currentScore, className: 'current' },
    { label: t('stats.highScore'), value: highScore, className: 'highlight' },
    { label: t('stats.played'), value: gamesPlayed },
    { label: t('stats.won'), value: gamesWon },
    { label: t('stats.winRate'), value: `${winRate}%` },
    { label: t('stats.average'), value: averageScore },
  ]

  return (
    <div className='statistics'>
      <h1 ref={headingRef} tabIndex={-1}>
        <span className={`outcome-emoji ${outcome}`} aria-hidden='true'>{emoji}</span> {title}
      </h1>
      <p className='victory-message'>{message}</p>

      <div className='stats-container'>
        {statItems.map((item, index) => (
          <div
            key={item.label}
            className={`stat-item ${item.className || ''}`}
            style={{ '--i': index }}
          >
            <span className='stat-label'>{item.label}</span>
            <span className='stat-value'>{item.value}</span>
          </div>
        ))}
      </div>

      <div className='stats-buttons'>
        <button onClick={onRestart}>{t('stats.playAgain')}</button>
        <button className='secondary' onClick={onBackToMenu}>{t('stats.backToMenu')}</button>
      </div>
    </div>
  )
}
