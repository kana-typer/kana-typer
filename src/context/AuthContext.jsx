import { createContext, useContext, useState, useEffect } from 'react'
import { GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { signInAnonymous } from '../utils/auth'
import { createInitialUserData } from '../utils/db'


const USER_TYPE_GOOGLE = 'google'
const USER_TYPE_ANONYMOUS = 'anonymous'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentUserType, setCurrentUserType] = useState(null)
  const [isSigningIn, setIsSigningIn] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, updateUser)
    return () => unsubscribe()
  }, [])

  const updateUser = async (user) => {
    setIsSigningIn(true)

    console.log('updateUser')

    if (!user) {
      setCurrentUser(null)
      setCurrentUserType(null)

      console.log('No user signed in - signing in as anonymous...')
      await signInAnonymous()
    } else {
      const signedInViaGoogle = user.providerData.some(
        provider => provider.providerId === GoogleAuthProvider.PROVIDER_ID
      )

      if (signedInViaGoogle) {
        setCurrentUserType(USER_TYPE_GOOGLE)
        console.log(`Signed in with Google, uid=${user.uid}|${auth.currentUser.uid}`)
      } else {
        setCurrentUserType(USER_TYPE_ANONYMOUS)
        console.log(`Signed in anonymously, uid=${user.uid}|${auth.currentUser.uid}`)
      }

      setCurrentUser(() => ({ ...user }))
      createInitialUserData(user)
    }

    setIsSigningIn(false)
  }

  const value = {
    currentUser,
    currentUserType,
    isSigningIn,
    forceUpdate: () => updateUser(auth.currentUser),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
