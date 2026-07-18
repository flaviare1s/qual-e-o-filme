import './App.css'
import { useState, useEffect } from 'react'
import { StartScreen } from './components/StartScreen'
import { Game } from './components/Game'
import moviesData from './moviesData.json'
import moviesDataEN from './moviesDataEN.json'
import { Toaster } from 'react-hot-toast'
import { Footer } from './components/Footer'
import { LanguageSwitch } from './components/LanguageSwitch'
import { useTranslation } from './i18n/context'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
]

// Mapas id -> título em cada idioma, calculados uma vez.
const titlesById = (data) => Object.fromEntries(data.map((m) => [m.id, m.title]))
const ptTitles = titlesById(moviesData)
const enTitles = titlesById(moviesDataEN)

// Anexa os títulos aceitos (pt + en) a um filme, para acertar em qualquer idioma.
const withAcceptedTitles = (movie) => ({
  ...movie,
  acceptedTitles: [ptTitles[movie.id], enTitles[movie.id]].filter(Boolean),
})

export function App() {
  const { lang } = useTranslation()
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
    const source = lang === 'en' ? moviesDataEN : moviesData
    const shuffledArray = [...source]
    shuffledArray.sort(() => Math.random() - 0.5)
    return shuffledArray.map(withAcceptedTitles)
  }

  // Trocar de idioma no meio do jogo: mantém a ordem embaralhada e o índice
  // atual, só remapeando cada filme para o mesmo id no outro idioma.
  useEffect(() => {
    setShuffledMovies((prev) => {
      if (prev.length === 0) return prev
      const source = lang === 'en' ? moviesDataEN : moviesData
      return prev.map((movie) =>
        withAcceptedTitles(source.find((m) => m.id === movie.id) || movie)
      )
    })
  }, [lang])

  return (
    <div className='main'>
      <LanguageSwitch />
      <div className='App'>
        <div className="overlay" />
        {gameStage === 'start' && <StartScreen startGame={startGame} />}
        {gameStage === 'game' && <Game moviesData={shuffledMovies} onBackToMenu={backToMenu} />}
        <Toaster position='top-center' />
      </div>
      <Footer />
    </div>
  )
}
