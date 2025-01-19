import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useGoogleAuth } from '../../context/GoogleAuthContext'

import { useTranslation } from 'react-i18next'

import Logo from '../../assets/logo_typer.svg'
import GoogleLogo from '../../assets/google-icon.svg'
import '../css/LoginPage.css'

function LoginPage() {
  const { currentUser, signIn } = useGoogleAuth()
  const location = useLocation()

  const { i18n, t } = useTranslation()

  if (currentUser !== null && !currentUser.isAnonymous) 
    return <Navigate to={location?.state?.from?.pathmane || '/'} replace />

  return (
    <>
      <div className="login-page__">
        <section className="login-page__left">
          <img src={Logo} alt="Logo" className="login-page__logo" />
        </section>

        <section className="login-page__right">
          <h1 className="login-page__title">{t('loginPage.joinUs')}</h1>
          <p className="login-page__subtitle">{t('loginPage.useGoogle')}</p>
          <p className="login-page__agreement">
          {t('loginPage.termsOfPolicy1')}<a href='/tos'>{t('loginPage.termsOfPolicy2')}</a>
          </p>
          <button className="login-page__button" onClick={signIn}>
            <img src={GoogleLogo} alt="Google logo" className="login-page__google-logo" />
            {t('loginPage.loginGoogle')}
          </button>
        </section>
      </div>
      <footer className="login-page__footer">kana typer</footer>
    </>
  )
}

export default LoginPage