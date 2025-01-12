import React from 'react';
import Logo from '../../assets/logo-kana.svg';
import { Link } from 'react-router-dom';
import '../css/HomePage.css';

import { useTranslation } from 'react-i18next'

function HomePage() {
  const { i18n, t } = useTranslation()

  return (
    <div className="home-page">
      
      <div className="home-page__left-section">
        <h1>{t('homePage.aboutUs')}</h1>
        <p>
        {t('homePage.homeText1')}<br />
        {t('homePage.homeText2')}<br /><br />

        {t('homePage.homeText3')}<br /><br />

        {t('homePage.homeText4')}<br /><br />

        {t('homePage.homeText5')}<br /><br />

        {t('homePage.homeText6')}

        </p>
      </div>

      
      <div className="home-page__right-section">
        <img src={Logo} alt="Logo" className="home-page__logo" />
        <Link to="/login" className="home-page__join-button">{t('homePage.loginGoogle')}</Link>
      </div>
    </div>
  );
}

export default HomePage;
