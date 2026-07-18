/* eslint-disable react/prop-types */
import './StartScreen.css'
import { GameRules } from './GameRules'
import { playClick } from '../utils/sound'

export const StartScreen = ({ startGame }) => {
  const handleStart = () => {
    playClick()
    startGame()
  }

  return (
    <div className='start'>
      <h1>QUAL É O FILME?</h1>
      <p>Clique no botão abaixo para começar a jogar!</p>
      <button onClick={handleStart}>Iniciar</button>
      <GameRules />
    </div>
  )
}
