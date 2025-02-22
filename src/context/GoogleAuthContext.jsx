import { createContext, useContext, useState, useEffect } from 'react'
import { deleteUser, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const GoogleAuthContext = createContext()

export const useGoogleAuth = () => useContext(GoogleAuthContext)

export default function _GoogleAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setIsSigningIn(false)

      if (user === null) {
        setUserData(null)
        return
      }

      const userRef = doc(db, 'users', auth.currentUser.uid)
      const userDoc = await getDoc(userRef)
      const today = new Date()
      let userData = {
        signedOn: Timestamp.fromDate(today),
        lastLoginOn: Timestamp.fromDate(today),
        isAnonymous: auth.currentUser.isAnonymous,
      }

      if (!userDoc.exists()) {
        console.log('Signed in today')
        await setDoc(userRef, userData)
      } else {
        await updateDoc(userRef, {
          lastLoginOn: Timestamp.fromDate(today),
          isAnonymous: auth.currentUser.isAnonymous,
        })
  
        userData = userDoc.data()
        console.log(`First sign in on ${userData?.signedOn?.toDate()?.toString()}`)
        console.log(`Last login on ${userData?.lastLoginOn?.toDate()?.toString()}`)
      }

      setUserData(userData)
    })

    return () => unsubscribe()
  }, [])

  const authSignIn = async () => {
    setIsSigningIn(true)

    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    try {
      const result = await signInWithPopup(auth, provider)
      console.log('Successfully signed in:', result)
    }
    catch (error) {
      console.log(error)
      switch (error?.code) {
        case 'auth/popup-closed-by-user':
          console.info('Sign-in popup closed by user')
          setIsSigningIn(false)
          break
        default:
          console.error('Error during Google sign-in:', error)
          setIsSigningIn(false)
      }
    }
  }
  
  const authSignOut = async () => {
    try {
      await signOut(auth)
      console.log('Signed out')
    } catch (error) {
      console.error('Error during sign-out:', error)
    }
  }

  const authDelete = async () => {
    const user = auth.currentUser

    try {
      await deleteUser(user)
      console.log('Account deleted')
    } catch (error) {
      console.error('Error during account deletion:', error)

      if (error.code === 'auth/requires-recent-login') {
        alert('Please re-authenticate to delete your account')
        await authSignIn()
        await authDelete()
        await authSignOut()
      }
    }
  }

  const value = {
    currentUser,
    isSigningIn,
    userData,
    signIn: authSignIn,
    signOut: authSignOut,
    deleteAccount: authDelete,
  }

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  )
}
