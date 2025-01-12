import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useGoogleAuth } from '../../context/GoogleAuthContext'

import Logo from '../../assets/logo_typer.svg'
import GoogleLogo from '../../assets/google-icon.svg'
import '../css/LoginPage.css'

function LoginPage() {
  const { currentUser, signIn } = useGoogleAuth()
  const location = useLocation()

  if (currentUser !== null && !currentUser.isAnonymous) 
    return <Navigate to={location?.state?.from?.pathmane || '/'} replace />

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={Logo} alt="Logo" className="login-logo" />
      </div>
      <div className="login-right">
        <h1 className="login-title">Join us!</h1>
        <p className="login-subtitle">Using the Google account.</p>
        <p className="login-agreement">
          By clicking "Log In with Google", you agree to our Terms of Service and Privacy Policy.
        </p>
        <button className="login-button" onClick={signIn}>
          <img src={GoogleLogo} alt="Google logo" className="google-logo" />
          Log In with Google
        </button>
      </div>
      <footer className="login-footer">kana typer</footer>
    </div>
  )
}

export default LoginPage