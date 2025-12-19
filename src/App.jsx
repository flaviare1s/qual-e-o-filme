import './App.css'
import { useState } from 'react'
import { StartScreen } from './components/StartScreen'
import { Game } from './components/Game'
import moviesData from './moviesData.json'
import { Toaster } from 'react-hot-toast'

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

  const backToMenu = () => {
    setGameStage(stages[0].name)
  }

  const shuffleMovies = () => {
    const shuffledArray = [...moviesData]
    shuffledArray.sort(() => Math.random() - 0.5)
    return shuffledArray
  }

  return (
    <div className='App'>
      <div className="overlay" />
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game moviesData={shuffledMovies} onBackToMenu={backToMenu} />}
      <Toaster position='bottom-center' />
    </div>
  )
}
