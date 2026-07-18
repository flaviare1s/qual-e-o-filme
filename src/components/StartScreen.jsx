/* eslint-disable react/prop-types */
import './StartScreen.css'
import { GameRules } from './GameRules'
import { playClick } from '../utils/sound'
import { useTranslation } from '../i18n/context'

export const StartScreen = ({ startGame }) => {
  const { t } = useTranslation()

  const handleStart = () => {
    playClick()
    startGame()
  }

  return (
    <div className='start'>
      <h1>{t('start.title')}</h1>
      <p>{t('start.subtitle')}</p>
      <button onClick={handleStart}>{t('start.button')}</button>
      <GameRules />
    </div>
  )
}
