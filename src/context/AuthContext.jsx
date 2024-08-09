import { createContext, useContext, useState, useEffect } from 'react'
import { GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { signInAnonymous } from '../utils/auth'


const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isGoogle, setIsGoogle] = useState(false) // TODO: ^ redo this as a singular state that houses name google|anonymous
  const [isSigningIn, setIsSigningIn] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, updateUser)
    return () => unsubscribe()
  }, [])

  const updateUser = async (user) => {
    if (!user) {
      setCurrentUser(null)
      console.warn('No user signed in - signing in as anonymous...')
      await signInAnonymous()
    } else {
      const signedInViaGoogle = user.providerData.some(
        provider => provider.providerId === GoogleAuthProvider.PROVIDER_ID
      )

      if (signedInViaGoogle) {
        setIsGoogle(true)
        console.log(`Signed in with Google, uid=${user.uid}|${auth.currentUser.uid}`)
      } else {
        setIsAnonymous(true)
        console.log(`Signed in anonymously, uid=${user.uid}|${auth.currentUser.uid}`)
      }
      // TODO: states seem to only refresh properly after page reload

      setCurrentUser(() => ({ ...user }))
    }

    setIsSigningIn(false)
  }

  const value = {
    currentUser,
    isAnonymous,
    isGoogle,
    isSigningIn,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
