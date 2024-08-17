import { emitLoginGoogle, emitLogout, useAuth } from '../context/AuthContext'

function LoginHandler() {
  const { currentUser, currentUserType, isSigningIn } = useAuth()

  return isSigningIn ? (
    <span>loading...</span>
  ) : (
    currentUserType === 'google' ? (
      <>
        <span style={{ marginRight: '1rem' }}>{`Logged in as ${currentUser?.displayName || 'unknown'} <${currentUser?.email || 'unknown'}>`}</span>
        <button onClick={emitLogout}>Log out from Google</button>
      </>
    ) : (
      <>
        <span style={{ marginRight: '1rem' }}>Logged in as anonymous</span>
        <button onClick={emitLoginGoogle}>Sign in with Google</button>
      </>
    )
  )
}

export default LoginHandler