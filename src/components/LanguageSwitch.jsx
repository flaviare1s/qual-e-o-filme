import './LanguageSwitch.css'
import { useTranslation } from '../i18n/context'
import { LANGUAGES } from '../i18n/translations'

export const LanguageSwitch = () => {
  const { t, lang, setLanguage } = useTranslation()

  return (
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
  )
}
