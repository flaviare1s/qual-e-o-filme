/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { LanguageContext } from './context'
import { translations, LANGUAGES } from './translations'

const resolve = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj)

const interpolate = (str, vars) =>
  str.replace(/\{(\w+)\}/g, (_, key) => (vars[key] != null ? vars[key] : `{${key}}`))

const initialLang = () => {
  const saved = localStorage.getItem('movieGameLang')
  return LANGUAGES.includes(saved) ? saved : 'pt'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  const setLanguage = (next) => {
    if (!LANGUAGES.includes(next)) return
    setLang(next)
    localStorage.setItem('movieGameLang', next)
  }

  // Mantém o <html lang> e o título da aba coerentes com o idioma (a11y + SEO).
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR'
    document.title = translations[lang].meta.title
  }, [lang])

  // t('a.b.c') retorna a string/array/objeto do caminho; interpola {vars} em
  // strings. Faz fallback para PT e, por fim, para a própria chave.
  const t = (key, vars) => {
    const value = resolve(translations[lang], key) ?? resolve(translations.pt, key) ?? key
    return typeof value === 'string' && vars ? interpolate(value, vars) : value
  }

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
