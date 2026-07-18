/* eslint-disable react/prop-types */
import './StartScreen.css'
import { GameRules } from './GameRules'
import { playClick } from '../utils/sound'
import { useTranslation } from '../i18n/context'
import { LANGUAGES } from '../i18n/translations'

export const StartScreen = ({ startGame }) => {
  const { t, lang, setLanguage } = useTranslation()

  const handleStart = () => {
    playClick()
    startGame()
  }

  return (
    <div className='start'>
      <div className='lang-switch' role='group' aria-label={t('lang.label')}>
        {LANGUAGES.map((code) => (
          <button
            key={code}
            type='button'
            className={`lang-btn ${lang === code ? 'active' : ''}`}
            onClick={() => setLanguage(code)}
            aria-pressed={lang === code}
            aria-label={t(`lang.${code}`)}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      <h1>{t('start.title')}</h1>
      <p>{t('start.subtitle')}</p>
      <button onClick={handleStart}>{t('start.button')}</button>
      <GameRules />
    </div>
  )
}
