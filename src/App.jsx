import { useState } from 'react'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot, runTransaction, setDoc, Timestamp } from 'firebase/firestore'
import { app as firebaseApp, auth, db } from './config/firebase'
import Typer from './components/Typer'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'


function App() {
  const signIn = async () => {
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
    }
    catch (err) {
      console.error('Error', err?.code || '', err?.message || 'unknown error')
    }
  }

  signIn()

  return (
    <>
      <span className='vl'></span>
      <Typer />
    </>
  )
}


export default App
