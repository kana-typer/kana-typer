import '../css/ProgressPage.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { getUserField } from '../../utils/db'

function ProgressPage() {
  const { i18n, t } = useTranslation()

  const [progress, setProgress] = useState({})

  useEffect(() => {
    const fetcher = async () => {
      const data = await getUserField('progress') || {}
      console.debug('Progress data fetched from db')
      setProgress(data)
    }

    fetcher()
  }, [])

  return (
    <>
      <section className='progress-page__box-top'>
        <h1 className='progress-page__header'>{t('progressDetails.progressTitle')}</h1>
        <h3 className='progress-page__description'>{t('progressDetails.progressDesc')}</h3>
      </section>

      <div className='progress-page__container'>

        <form className='progress-page__form' action='#'>
          <input className='progress-page__search-input' type='text' placeholder={t('common.search')} name='search'/>
          <button className='progress-page__search-button'>
            <i class="fa-solid fa-magnifying-glass"></i>{t('common.search')}
          </button>
        </form>

        <section className='progress'>
          <ul>
            <li>
              <h3>兎</h3>
              <div className='progress-bar'>
                <div className='bar'></div>
              </div>
            </li>
            <li>
              <h3>私</h3>
              <div className='progress-bar'>
                <div className='bar'></div>
              </div>
            </li>
            <li>
              <h3>する</h3>
              <div className='progress-bar'>
                <div className='bar'></div>
              </div>
            </li>
            <li>
              <h3>か</h3>
              <div className='progress-bar'>
                <div className='bar'></div>
              </div>
            </li>
            <li>
              <h3>時々</h3>
              <div className='progress-bar'>
                <div className='bar'></div>
              </div>
            </li>
          </ul>
        </section>

      </div>
    </>
  )
}

export default ProgressPage
