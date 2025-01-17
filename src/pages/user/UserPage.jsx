import '../css/UserPage.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { Navigate, useLocation } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { useGoogleAuth } from '../../context/GoogleAuthContext'

import { updateUserMapField } from '../../utils/db'
import { useMemo } from 'react'

function UserPage() {
  const { currentUser, userData, signOut, deleteAccount } = useGoogleAuth()
  const location = useLocation()

  const signedOnData = useMemo(() => {
    if (userData === null)
      return (new Date()).toLocaleDateString()
    return userData.signedOn.toDate().toLocaleDateString()
  }, [userData])

  if (currentUser === null || currentUser.isAnonymous)
    return <Navigate to='/login' state={{ from: location }} replace />

  const { i18n, t } = useTranslation()

  const resetProgress = async () => {
    await updateUserMapField('progress', {})
    alert('Progress has been reset')
  }

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

        <button className='user-page__logout' onClick={signOut}>{t('accountDetails.logOut')}</button>
        
        <hr className='user-page__line' />

        <section className='user-page__settings'>
          <h1 className='user-page__settings-text'>{t('accountDetails.accountSettings')}</h1>
          <button className='user-page__reset' onClick={resetProgress}>{t('accountDetails.resetAcc')}</button>
          <button className='user-page__delete' onClick={deleteAccount}>{t('accountDetails.deleteAcc')}</button>
        </section>
      </section>
    </>
  )
}

export default UserPage
