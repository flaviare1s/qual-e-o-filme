import './GameRules.css'
import { useTranslation } from '../i18n/context'

export const GameRules = () => {
  const { t } = useTranslation()

  return (
    <div className='rules-wrapper'>
      <div className='rules'>
        <h2>{t('rules.title')}</h2>
        <ul>
          {t('rules.items').map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
