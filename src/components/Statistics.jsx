/* eslint-disable react/prop-types */
import './Statistics.css'
import { useEffect, useRef } from 'react'
import { playWin, playLose, playFinish } from '../utils/sound'

const OUTCOMES = {
  win: { emoji: '🎉', title: 'Parabéns!', message: 'Você acertou todos os filmes!' },
  finish: { emoji: '🎬', title: 'Fim dos filmes', message: 'Você chegou ao fim, mas não adivinhou o último filme.' },
  lose: { emoji: '💀', title: 'Fim de jogo', message: 'Suas vidas acabaram. Tente de novo!' },
}

export function Statistics({ currentScore, onRestart, onBackToMenu, outcome = 'finish' }) {
  const headingRef = useRef(null)
  const { emoji, title, message } = OUTCOMES[outcome] || OUTCOMES.finish

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
    { label: 'Pontuação Atual', value: currentScore, className: 'current' },
    { label: 'Recorde', value: highScore, className: 'highlight' },
    { label: 'Jogos Jogados', value: gamesPlayed },
    { label: 'Jogos Vencidos', value: gamesWon },
    { label: 'Taxa de Vitória', value: `${winRate}%` },
    { label: 'Pontuação Média', value: averageScore },
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
        <button onClick={onRestart}>Jogar novamente</button>
        <button className='secondary' onClick={onBackToMenu}>Voltar ao menu</button>
      </div>
    </div>
  )
}
