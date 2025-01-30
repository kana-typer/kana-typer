import { Navigate, useLocation } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { useGoogleAuth } from '../../context/GoogleAuthContext'

import '../css/ProgressPage.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

function ProgressPage() {
  const { currentUser, userData } = useGoogleAuth()
  const location = useLocation()
  const { t } = useTranslation()

  if (currentUser === null || currentUser.isAnonymous)
    return <Navigate to='/login' state={{ from: location }} replace />

  return (
    <>
      <section className='progress-page__box-top'>
        <h1 className='progress-page__header'>{t('progressDetails.progressTitle')}</h1>
        <h3 className='progress-page__description'>{t('progressDetails.progressDesc')}</h3>
      </section>

      <div className='progress-page__container'>
        <section className='progress'>
          <ul>
            {Object.entries(userData?.progress || {}).map(([kana, progNum], idx) => (
              <li key={idx}>
                <h3>{kana}</h3>
                <div className="progress-bar">
                  <div className="bar" style={{ width: `${Math.max(Math.min(progNum, 10) * 10, 0)}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

export default ProgressPage
