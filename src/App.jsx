import { Suspense, memo, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { isDev } from './utils/globals'

import GoogleAuthProvider from './context/GoogleAuthContext'
import TyperDataProvider from './context/TyperDataContext'

import useLazyPlaceholder from './hooks/useLazyPlaceholder'

import Nav from './components/Nav'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './css/App.css'


const LazyPlaceholder = isDev ? memo(useLazyPlaceholder(1000)) : null

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
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
