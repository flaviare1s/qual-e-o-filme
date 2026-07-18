import './LanguageSwitch.css'
import { useTranslation } from '../i18n/context'

export const LanguageSwitch = () => {
  const { t, lang, setLanguage } = useTranslation()

  // Clicar em qualquer parte do botão alterna entre os dois idiomas.
  const toggle = () => setLanguage(lang === 'pt' ? 'en' : 'pt')

  return (
    <button
      type='button'
      className='lang-switch'
      onClick={toggle}
      aria-label={`${t('lang.label')}: ${t(`lang.${lang}`)}`}
    >
      <span className={`lang-seg ${lang === 'pt' ? 'active' : ''}`} aria-hidden='true'>PT</span>
      <span className={`lang-seg ${lang === 'en' ? 'active' : ''}`} aria-hidden='true'>EN</span>
    </button>
  )
}
