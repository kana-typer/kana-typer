import { useNavigate } from 'react-router-dom'
import { useGoogleAuth } from '../context/GoogleAuthContext'

import UserIcon from '../assets/user-icon.svg'

import '../css/Nav.css'

function LoginHandler() {
  const navigate = useNavigate()
  const { currentUser, isSigningIn, signIn } = useGoogleAuth()

  return isSigningIn ? (
    <span className='login-handler__loading-text'>loading...</span>
  ) : (
    currentUser === null || currentUser.isAnonymous ? (
      <button className='login-handler__btn' onClick={signIn}>Login</button>
    ) : (
      <img className='login-handler__pfp' src={currentUser?.photoURL || UserIcon} alt="User's profile picture" onClick={() => navigate('/user')} />
    )
  )
}

export default LoginHandler