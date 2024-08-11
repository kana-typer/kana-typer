import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { signInGoogle, signOutGoogle } from '../utils/auth'

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
    currentUserType === 'google' ? (
      <button onClick={signOutGoogle}>Log out from Google</button>
    ) : (
      <button onClick={signInGoogle}>Sign in with Google</button>
    )
  )
  
}

export default Tester