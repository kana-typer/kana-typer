import { useNavigate } from 'react-router-dom'
import { useGoogleAuth } from '../context/GoogleAuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faSpinner } from '@fortawesome/free-solid-svg-icons'

import UserIcon from '../assets/user-icon.svg'

import '../css/Nav.css'

function LoginHandler() {
  const navigate = useNavigate()
  const { currentUser, isSigningIn, signIn } = useGoogleAuth()

  return isSigningIn ? (
    <span className='login-handler__spinner'>
      <FontAwesomeIcon icon={faSpinner} className='spinner' />
    </span>
  ) : (
    currentUser === null || currentUser.isAnonymous ? (
      <button className='login-handler__btn btn' onClick={signIn}>
        <FontAwesomeIcon icon={faRightToBracket} />
        <span>Login</span>
      </button>
    ) : (
      <img className='login-handler__pfp' src={currentUser?.photoURL || UserIcon} alt="User's profile picture" onClick={() => navigate('/user')} />
    )
  )
}

export default LoginHandler