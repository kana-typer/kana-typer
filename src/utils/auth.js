import { GoogleAuthProvider, signInAnonymously, signInWithPopup, signOut, linkWithCredential, linkWithPopup } from "firebase/auth"
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

  try {
    const result = await linkWithPopup(auth.currentUser, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result)

    console.log(`Linked anonymous account (uid=${auth.currentUser.uid}) with Google account (email=${result.user.email})`)
  } catch (error) {
    if (error.code === 'auth/credential-already-in-use') { // TODO: definitely is a better way to check if this google account has a uid in database, right?
      console.error(`This Google account (uid=${auth.currentUser.uid}) is already linked with another user - signing in without linking...`, error)

      try {
        const result = await signInWithPopup(auth, provider)
      } catch (error) {
        console.error('signInGoogle_2:', error)
      }
    } else {
      console.error('signInGoogle:', error)
    }
  }

  // try {
  //   const result = await signInWithPopup(auth, provider)
  //   const credentials = GoogleAuthProvider.credentialFromResult(result)

  //   if (auth.currentUser?.isAnonymous) {
  //     await linkWithCredential(auth.currentUser, credentials)
  //     console.log('Linked user to Google account')
  //   }
    
  // } catch (error) {
  //   const credentials = GoogleAuthProvider.credentialFromError(error)

  //   if (error.code === 'auth/credential-already-in-use') {
  //     console.error(`signInGoogle: This Google account (uid=${auth.currentUser.uid}) is already linked with another user.`, error)
  //   } else {
  //     console.error('signInGoogle:', error)
  //   }
  // }
}

export const signOutGoogle = async () => {
  try {
    await signOut(auth)
    console.log('Signed out')
  } catch (error) {
    console.error('signOut:', error)
  }
}