import { emitLoginGoogle, emitLogout, useAuth } from '../context/AuthContext'

import '../css/Nav.css'

function LoginHandler() {
  const { currentUser, currentUserType, isSigningIn } = useAuth()

  return isSigningIn ? (
    <span className='login-handler__loading-text'>loading...</span>
  ) : (
    currentUserType === 'google' ? (
      <>
        <span className='login-handler__google'>{`Logged in as ${currentUser?.displayName || 'unknown'} <${currentUser?.email || 'unknown'}>`}</span>
        <button onClick={emitLogout}>Log out from Google</button>
      </>
    ) : (
      <>
        <span className='login-handler__google'>Logged in as anonymous</span>
        <button onClick={emitLoginGoogle}>Sign in with Google</button>
      </>
    )
  )
}

export default LoginHandler