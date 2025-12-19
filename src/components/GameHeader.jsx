/* eslint-disable react/prop-types */
import './GameHeader.css'
import { FaHeart, FaLightbulb, FaTrophy } from 'react-icons/fa'

export function GameHeader({ score, lives, remainingHints }) {
  return (
    <div className="game-header">
      <div className="game-header-item">
        <FaTrophy className="header-icon" />
        <span className="header-value">{score}</span>
      </div>

      <div className="game-header-item">
        <FaHeart className="header-icon heart-icon" />
        <span className="header-value">{lives}</span>
      </div>

      <div className="game-header-item">
        <FaLightbulb className="header-icon bulb-icon" />
        <span className="header-value">{Math.max(remainingHints, 0)}</span>
      </div>
    </div>
  )
}
