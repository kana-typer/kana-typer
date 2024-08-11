import { GoogleAuthProvider, signInAnonymously, signInWithPopup, signOut, linkWithCredential, linkWithPopup, signInWithCredential, linkWithRedirect, reauthenticateWithCredential } from "firebase/auth"
import { auth } from "../config/firebase"


export const signInAnonymous = async () => {
  try {
    const result = await signInAnonymously(auth)
  } catch (error) {
    console.error('signInAnonymously:', error)
  }
}

export const signInGoogle = async () => {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  let credential = null
  let forceAuthStateChanged = false

  try {
    const result = await linkWithPopup(auth.currentUser, provider)
    credential = GoogleAuthProvider.credentialFromResult(result)
    forceAuthStateChanged = true
    console.log(`Linked anonymous account with Google account (uid=${auth.currentUser.uid})`)
  } catch (error) {
    switch (error.code) {
      case 'auth/credential-already-in-use': 
        console.warn(`Used Google account is already linked with another user - signing in without linking...`)
        credential = GoogleAuthProvider.credentialFromError(error)
        break
      case 'auth/popup-closed-by-user':
        console.info('Sign in cancelled by the user')
        return
      default:
        console.error('signInGoogle.linkWithPopup:', error)
    }
  }

  try {
    if (credential) {
      const result = await signInWithCredential(auth, credential)
      if (forceAuthStateChanged) {
        await auth.currentUser.getIdToken(true)
      }
    } else {
      throw Error('Credential is null')
    }
  } catch (error) {
    console.error('signInGoogle.signInWithCredential:', error)
  }
}

export const signOutGoogle = async () => {
  try {
    await signOut(auth)
    console.log('Signed out')
  } catch (error) {
    console.error('signOut:', error)
  }
}