import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

i18next
  .use(initReactI18next)
  .init({
    // https://www.i18next.com/overview/configuration-options#logging
    debug: process.env.NODE_ENV === 'development',
    lng: 'en',
    fallback: 'en',
    interpolation: {
      escapeValues: false,
    },
    resources: {
      en: {
        translation: {
          title: 'This is a locale test',
        }
      },
      pl: {
        translation: {
          title: 'To jest test lokali',
        }
      },
    }
  })

export default i18next
