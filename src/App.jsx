import { Suspense, useState } from 'react'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { collection, onSnapshot } from 'firebase/firestore'
import { app as firebaseApp, db } from './config/firebase'
import { useTranslation } from 'react-i18next'

import Typer from './components/Typer'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './css/App.css'


function App() {
  const { i18n, t } = useTranslation()

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
    <Suspense fallback='loading'>
      <span className='vl'></span>
      <Typer />
      <div>
        <h1>{t('title')}</h1>
        <select defaultValue={i18n.language} onChange={e => {
          i18n.changeLanguage(e.target.value)
        }}>
          <option key={1} value="en">English</option>
          <option key={2} value="pl">Polski</option>
        </select>
      </div>
    </Suspense>
  )
}


export default App
