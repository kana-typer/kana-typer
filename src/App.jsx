import { useState } from 'react'
import { GoogleAuthProvider, signInAnonymously, signInWithPopup, signOut } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore'
import { app as firebaseApp, auth, db } from './config/firebase'
import Typer from './components/Typer'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'


function App() {
  const signInAnon = async () => {
    try {
      if (!auth.currentUser) { // fires on page refresh
        await signInAnonymously(auth)
        console.log(`Fresh anonymous sign in with uid=${auth.currentUser.uid}`)
      } else { // fires on hot reload
        console.log(`Already anonymously signed in with uid=${auth.currentUser.uid}`)
      }

      onSnapshot(collection(db, 'test'), snapshot => {
        const docArr = snapshot.docs.map(doc => doc.data())
        console.log(`Connection to db, success=${docArr?.[0]?.isActive == true}`)
      })

      const userRef = doc(db, 'users', auth.currentUser.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        console.log('First login today')
        await setDoc(userRef, {
          firstLogin: Timestamp.fromDate(new Date())
        })
      } else {
        const userData = userDoc.data()
        console.log(`First login on ${userData.firstLogin.toDate().toString()}`)
      }
    } catch (error) {
      console.error('Error signInAnon', error?.code || '', error?.message || 'unknown error')
    }
  }

  const signInGoogle = async () => {
    const provider = new GoogleAuthProvider()

    try {
      const result = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const user = result.user

      console.log(`Signed in with Google: uid=${auth.currentUser.uid}`)
      console.log(user, credential)
    } catch (error) {
      const credential = GoogleAuthProvider.credentialFromError(err)
      console.error('Error signInGoogle', error?.code || '', error?.message || 'unknown error')
    }

    console.log(provider)
  }

  const signOutGoogle = async () => {
    try {
      await signOut(auth)
      console.log('Signed out from Google')
      await signInAnon()
    } catch (error) {
      console.error('Error signOutGoogle', error?.code || '', error?.message || 'unknown error')
    }
  }

  signInAnon()

  return (
    <>
      <span className='vl'></span>
      <Typer />
      <button onClick={signInGoogle}>Sign in with Google</button>
      <button onClick={signOutGoogle}>Log out from Google</button>
    </>
  )
}


export default App
