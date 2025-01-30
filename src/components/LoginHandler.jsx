import { useNavigate } from 'react-router-dom'
import { useGoogleAuth } from '../context/GoogleAuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faUser } from '@fortawesome/free-solid-svg-icons'

import UserIcon from '../assets/user-icon.svg'

import '../css/Nav.css'

function LoginHandler() {
  const navigate = useNavigate()
  const { currentUser, isSigningIn } = useGoogleAuth()

  return isSigningIn ? (
    <span className='login-handler__spinner'>
      <FontAwesomeIcon icon={faSpinner} className='spinner' />
    </span>
  ) : (
    currentUser === null || currentUser.isAnonymous ? (
      <div className='login-handler__btn' onClick={() => navigate('/user')}>
        <FontAwesomeIcon icon={faUser} />
      </div>
    ) : (
      <img className='login-handler__pfp' loading='lazy' src={currentUser?.photoURL || UserIcon} alt="User's profile picture" onClick={() => navigate('/user')} />
    )
  )
}

export default LoginHandler