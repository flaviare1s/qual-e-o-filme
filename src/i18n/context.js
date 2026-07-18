import { createContext, useContext } from 'react'

// Contexto e hook ficam separados do Provider para não misturar exports de
// componente com não-componente (regra react-refresh/only-export-components).
export const LanguageContext = createContext(null)

export const useTranslation = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useTranslation deve ser usado dentro de <LanguageProvider>')
  }
  return ctx
}
