import { Suspense, memo } from 'react'
import { Outlet } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { isDev } from './utils/globals'

import GoogleAuthProvider from './context/GoogleAuthContext'
import TyperDataProvider from './context/TyperDataContext'

import useLazyPlaceholder from './hooks/useLazyPlaceholder'

import Nav from './components/Nav'

import './css/App.css'


const LazyPlaceholder = isDev ? memo(useLazyPlaceholder(1000)) : null

function App() {
  return (
    <Suspense fallback={<div className='full-page-spinner'><FontAwesomeIcon icon={faSpinner} className='spinner' /></div>}>
      <GoogleAuthProvider>
        <TyperDataProvider>
          <Nav />
          <main>
            <Outlet/>
            {LazyPlaceholder && <LazyPlaceholder />}
          </main>
        </TyperDataProvider>
      </GoogleAuthProvider>
    </Suspense>
  )
}


export default App
