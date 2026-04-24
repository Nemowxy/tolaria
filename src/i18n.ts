import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from '../locales/en/translation.json'
import zhTranslation from '../locales/zh/translation.json'

const resources = {
  en: { translation: enTranslation },
  zh: { translation: zhTranslation },
}

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'tolaria-language',
    },
  })

export default i18next
