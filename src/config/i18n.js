import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { isDev } from '../utils/globals'

i18next
  .use(I18NextHttpBackend)
  .use(initReactI18next)
  .init({
    // https://www.i18next.com/overview/configuration-options#logging
    debug: isDev(),
    lng: 'en',
    fallback: 'en',
    interpolation: {
      escapeValues: false,
    },
    backend: {
      loadPath: `/i18n/{{lng}}.json`,
    },
  })

export default i18next
