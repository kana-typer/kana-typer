import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { signInGoogle, signOutGoogle } from '../utils/auth'
import { createInitialUserData } from '../utils/db'

function Tester() {
  const { currentUser, isGoogle, isAnonymous, isSigningIn } = useAuth()

  useEffect(() => {
    if (currentUser) {
      console.log('Tester', currentUser, isGoogle, isAnonymous)
      createInitialUserData()
    }
  }, [currentUser])

  return isSigningIn ? (
    <span>loading...</span>
  ) : (
    isGoogle ? (
      <button onClick={signOutGoogle}>Log out from Google</button>
    ) : (
      <button onClick={signInGoogle}>Sign in with Google</button>
    )
  )
  
}

export default Tester