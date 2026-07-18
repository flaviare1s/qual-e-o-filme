import "./Footer.css"
import { useTranslation } from '../i18n/context'

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer>
      <p>{t('footer.by')} <a href="https://github.com/flaviare1s" target="_blank" rel="noopener noreferrer">Flávia Reis</a></p>
    </footer>
  )
}
