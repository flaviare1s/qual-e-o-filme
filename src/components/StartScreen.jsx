import React from 'react'


import './StartScreen.css'
import { GameRules } from './GameRules'



export const StartScreen = ({ startGame }) => {
  return (
    <div className='start'>
      <h1>QUAL É O FILME?</h1>
      <p>Clique no botão abaixo para começar a jogar!</p>
      <button onClick={startGame}>Iniciar</button>
      < GameRules />
    </div>
  )
}