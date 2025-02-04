import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGoogleAuth } from '../../context/GoogleAuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faFileCircleExclamation, faArrowRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons'

import { updateUserMapField } from '../../utils/db'

import '../css/UserPage.css'
import '@fortawesome/fontawesome-free/css/all.min.css'


function UserPage() {
  const { currentUser, userData, signOut, deleteAccount } = useGoogleAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const signedOnData = useMemo(() => {
    if (userData === null)
      return (new Date()).toLocaleDateString()
    return userData.signedOn.toDate().toLocaleDateString()
  }, [userData])

  const { t } = useTranslation()

  const resetProgress = async () => {
    await updateUserMapField('progress', {})
    alert('Progress has been reset')
  }

  if (currentUser === null || currentUser.isAnonymous)
    return <Navigate to='/login' state={{ from: location }} replace />

  return (
    <>
      <section className='user-page__box-top'>
        <h1 className='user-page__header'>{t('accountDetails.profile')}</h1>
        <h3 className='user-page__description'>{t('accountDetails.accoutDesc')}</h3>
      </section>

      <section className='user-page__box-bottom'>
        <h1 className='user-page__profile-text'>{t('accountDetails.accountInfo')}</h1>

        <section className='user-page__grid'>
          <div className='user-page__profile-pic'>
            <img className='user-page__profile-pic__img' src={currentUser?.photoURL || GoogleLogo} alt="User's profile picture" />
          </div>

          <ul className='user-page__profile-fields'>
            <li>
              <h3 className='user-page__profile__name'>{t('accountDetails.username')}</h3>
              <h4 className='user-page__profile__content'>{currentUser?.displayName || 'unknown'}</h4>
            </li>
            <li>
              <h3 className='user-page__profile__name'>{t('accountDetails.email')}</h3>
              <h4 className='user-page__profile__content'>{currentUser?.email || 'unknown'}</h4>
            </li>
            <li>
              <h3 className='user-page__profile__name'>{t('accountDetails.firstLogin')}</h3>
              <h4 className='user-page__profile__content'>{signedOnData}</h4>
            </li>
          </ul>
        </section>

        <section className='user-page__settings'>
          <button className='user-page__logout btn btn-alt-1' onClick={signOut}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>{t('accountDetails.logOut')}</span>
          </button>
          <hr className='user-page__line' />
          <h1 className='user-page__settings-text'>{t('accountDetails.accountSettings')}</h1>
          <button className='user-page__tos btn btn-alt-2' onClick={() => navigate('/tos')}>
            <FontAwesomeIcon icon={faFileCircleExclamation} />
            <span>{t('accountDetails.accountToS')}</span>
          </button>
          <button className='user-page__reset btn btn-alt-1' onClick={resetProgress}>
            <FontAwesomeIcon icon={faArrowRotateRight} />
            <span>{t('accountDetails.resetAcc')}</span>
          </button>
          <button className='user-page__delete btn' onClick={deleteAccount}>
            <FontAwesomeIcon icon={faTrash} />
            <span>{t('accountDetails.deleteAcc')}</span>
          </button>
        </section>
      </section>
    </>
  )
}

export default UserPage
