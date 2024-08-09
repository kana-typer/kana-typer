import { useState } from 'react'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { collection, onSnapshot } from 'firebase/firestore'
import { app as firebaseApp, db } from './config/firebase'
import { Outlet } from 'react-router-dom';
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
    <main>
      <nav>
        <a href="/">HomePage</a> |
        <a href="typer">Typer</a> |
        <a href="dict">Dictionary</a> |
        <a href="progress">Progress</a> |
        <a href="help">Help</a> |
        <a href="user">Account</a> |
      </nav>
      <Outlet/>
    </main>
  )
}


export default App
