import '../css/UserPage.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

import { useTranslation } from 'react-i18next'

function UserPage() {
  const { i18n, t } = useTranslation()

  return (
    <>
      <section className='user-page__box-top'>
        <h1 className='user-page__header'>{t('accountDetails.profile')}</h1>
        <h3 className='user-page__description'>{t('accountDetails.accoutDesc')}</h3>
      </section>

      <section className='user-page__box-bottom'>
        <h1 className='user-page__profile-text'>{t('accountDetails.accountInfo')}</h1>
        <section className='user-page__grid'>
          <div className='user-page__profile-pic'></div>

          <ul className='user-page__profile-fields'>
            <li>
              <h3 className='user-page__profile__name'>{t('accountDetails.username')}</h3>
              <h4 className='user-page__profile__content'>username1</h4>
            </li>
            <li>
              <h3 className='user-page__profile__name'>{t('accountDetails.email')}</h3>
              <h4 className='user-page__profile__content'>email@gmail.com</h4>
            </li>
            <li>
              <h3 className='user-page__profile__name'>{t('accountDetails.firstLogin')}</h3>
              <h4 className='user-page__profile__content'>01-01-2025</h4>
            </li>
          </ul>

        </section>

        <button className='user-page__logout'>{t('accountDetails.logOut')}</button>
        
        <hr className='user-page__line' />

        <section className='user-page__settings'>
          <h1 className='user-page__settings-text'>{t('accountDetails.accountSettings')}</h1>
          <button className='user-page__reset'>{t('accountDetails.resetAcc')}</button>
          <button className='user-page__delete'>{t('accountDetails.deleteAcc')}</button>
        </section>
      </section>
    </>
  )
}

export default UserPage
