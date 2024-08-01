import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

i18next
  .use(initReactI18next)
  .init({
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
