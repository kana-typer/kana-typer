import { useState } from 'react'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { collection, onSnapshot } from 'firebase/firestore'
import { app as firebaseApp, db } from './config/firebase'
import Typer from './components/Typer'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'


function App() {
  const auth = getAuth()
  signInAnonymously(auth)
    .then(() => {
      console.log('Signed in')

      onSnapshot(collection(db, 'test'), snapshot => {
        const docArr = snapshot.docs.map(doc => doc.data())
        console.log(`connection to db successful = ${docArr?.[0]?.isActive == true}`)
      })
    })
    .catch(err => {
      console.error('Error', err?.code || '', err?.message || 'unknown error')
    })

  return (
    <>
      <span className='vl'></span>
      <Typer />
    </>
  )
}


export default App
