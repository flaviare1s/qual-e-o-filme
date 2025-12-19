/* eslint-disable react/prop-types */
import './Statistics.css'

export function Statistics({ currentScore, onRestart, onBackToMenu, isVictory = false }) {
  const stats = JSON.parse(localStorage.getItem('movieGameStats') || '{}')
  const highScore = stats.highScore || 0
  const gamesPlayed = stats.gamesPlayed || 0
  const gamesWon = stats.gamesWon || 0
  const totalScore = stats.totalScore || 0

  const averageScore = gamesPlayed > 0 ? Math.round(totalScore / gamesPlayed) : 0
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0

  return (
    <div className='statistics'>
      <h1>{isVictory ? '🎉 Parabéns!' : 'Estatísticas'}</h1>
      {isVictory && <p className='victory-message'>Você completou todos os filmes!</p>}

      <div className='stats-container'>
        <div className='stat-item current'>
          <span className='stat-label'>Pontuação Atual</span>
          <span className='stat-value'>{currentScore}</span>
        </div>

        <div className='stat-item highlight'>
          <span className='stat-label'>Recorde</span>
          <span className='stat-value'>{highScore}</span>
        </div>

        <div className='stat-item'>
          <span className='stat-label'>Jogos Jogados</span>
          <span className='stat-value'>{gamesPlayed}</span>
        </div>

        <div className='stat-item'>
          <span className='stat-label'>Jogos Vencidos</span>
          <span className='stat-value'>{gamesWon}</span>
        </div>

        <div className='stat-item'>
          <span className='stat-label'>Taxa de Vitória</span>
          <span className='stat-value'>{winRate}%</span>
        </div>

        <div className='stat-item'>
          <span className='stat-label'>Pontuação Média</span>
          <span className='stat-value'>{averageScore}</span>
        </div>
      </div>

      <div className='stats-buttons'>
        <button onClick={onRestart}>Jogar Novamente</button>
        <button onClick={onBackToMenu}>Menu Principal</button>
      </div>
    </div>
  )
}
