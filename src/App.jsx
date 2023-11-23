import './App.css'

import { useCallback, useEffect, useState } from 'react'

import { StartScreen } from './components/StartScreen'
import { Game } from './components/Game'

import moviesData from './moviesData.json'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
]

export function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [shuffledMovies, setShuffledMovies] = useState([])

  const startGame = () => {
   
    setShuffledMovies(shuffleMovies())
    setGameStage(stages[1].name)
  }

  const shuffleMovies = () => {
    const shuffledArray = [...moviesData]
    shuffledArray.sort(() => Math.random() - 0.5)
    return shuffledArray
  }

  return (
    <div className='App'>
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game moviesData={shuffledMovies} />}
    </div>
  )
}