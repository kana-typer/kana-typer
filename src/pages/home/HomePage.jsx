import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGoogleAuth } from '../../context/GoogleAuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons'

import Logo from '/logo.svg'

import '../css/HomePage.css'

function HomePage() {
  const { t } = useTranslation()
  const { currentUser } = useGoogleAuth()

  return (
    <div className='home-page'>
      <section className='home-page__left-section'>
        <h1 className='home-page__title'>{t('homePage.aboutUs')}</h1>

        <div className='home-page__text'>
          <div className='home-page__intro'>{t('homePage.homeText1')}</div>
          <div className='home-page__intro'>{t('homePage.homeText2')}</div>
          <div className='home-page__desc'>{t('homePage.homeText3')}</div>
          <div className='home-page__desc'>{t('homePage.homeText4')}</div>
          <div className='home-page__desc'>{t('homePage.homeText5')}</div>
          <div className='home-page__desc'>{t('homePage.homeText6')}</div>
        </div>
      </section>
      
      <section className='home-page__right-section'>
        <img src={Logo} alt='Logo' className='home-page__logo' />
        {currentUser === null ? (
          <Link to='/login' className='home-page__join-button btn'>
            <FontAwesomeIcon icon={faRightToBracket} />
            <span>{t('loginPage.loginGoogle')}</span>
          </Link>
        ) : (
          <Link to='/user' className='home-page__join-button btn'>
            <FontAwesomeIcon icon={faUser} />
            <span>{t('loginPage.goToProfile')}</span>
          </Link>
        )}
      </section>
    </div>
  )
}

export default HomePage
