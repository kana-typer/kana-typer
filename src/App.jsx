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
      // console.log(firebaseApp)

      // TODO: how does it work?! Rules in Firebase are weird
      // onSnapshot(collection(db, 'test'), snapshot => {
      //   console.log(snapshot)
      // })
    })
    .catch(err => {
      console.error('Error', err?.code || '', err?.message || 'unknown error')
    })

  return (
    <>
      <vl />
      <Typer />
    </>
  )
}


export default App
