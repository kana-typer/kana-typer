import { useEffect } from 'react'
import { emitLoginGoogle, emitLogout, useAuth } from '../../context/AuthContext'

function Tester() {
  const { currentUser, currentUserType, isSigningIn } = useAuth()

  useEffect(() => {
    if (currentUser) {
      console.log('Tester', currentUser, currentUserType)
    }
  }, [currentUser])

  return isSigningIn ? (
    <span>loading...</span>
  ) : (
    <>
      {currentUserType === 'google' ? (
        <button onClick={emitLogout}>Log out from Google</button>
      ) : (
        <button onClick={emitLoginGoogle}>Sign in with Google</button>
      )}
    </>
  )
  
}

export default Tester