import React from 'react';
import Logo from '../../assets/logo-kana.svg';
import { Link } from 'react-router-dom';
import '../css/HomePage.css';

import { useTranslation } from 'react-i18next'

function HomePage() {
  const { i18n, t } = useTranslation()

  return (
    <div className="home-page">
      <section className="home-page__left-section">
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
      
      <section className="home-page__right-section">
        <img src={Logo} alt="Logo" className="home-page__logo" />
        <Link to="/login" className="home-page__join-button">{t('loginPage.loginGoogle')}</Link>
      </section>
    </div>
  );
}

export default HomePage;
