/* eslint-disable react/prop-types */
import './GameHeader.css'
import { FaHeart, FaLightbulb, FaTrophy, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'

export function GameHeader({ score, lives, remainingHints, muted, onToggleMute }) {
  const hints = Math.max(remainingHints, 0)

  return (
    <div className="game-header" role="status" aria-live="polite">
      <div className="game-header-item" aria-label={`Pontuação: ${score}`}>
        <FaTrophy className="header-icon" aria-hidden="true" />
        <span className="header-value score-value" key={score}>{score}</span>
      </div>

      <div className="game-header-item" aria-label={`Vidas restantes: ${lives}`}>
        <FaHeart className="header-icon heart-icon" key={lives} aria-hidden="true" />
        <span className="header-value">{lives}</span>
      </div>

      <div className="game-header-item" aria-label={`Dicas restantes: ${hints}`}>
        <FaLightbulb className="header-icon bulb-icon" aria-hidden="true" />
        <span className="header-value">{hints}</span>
      </div>

      <button
        type="button"
        className="mute-btn"
        onClick={onToggleMute}
        aria-pressed={muted}
        aria-label={muted ? 'Ativar som' : 'Desativar som'}
      >
        {muted ? <FaVolumeMute aria-hidden="true" /> : <FaVolumeUp aria-hidden="true" />}
      </button>
    </div>
  )
}
