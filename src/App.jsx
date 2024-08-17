import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AuthProvider from './context/AuthContext'
// import Tester from './pages/typer/Tester'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './css/App.css'

 // TODO: REMOVE LATER ... puts <Tester /> here after 1 second - simulates long page load
const LazyComponentToTestSuspense = lazy(() => new Promise(resolve => setTimeout(resolve, 1000)).then(() => import('./pages/typer/Tester')))

function App() {
  const { i18n, t } = useTranslation()
  console.log('HERE', i18n)

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthProvider>
        <main>
          <nav style={{ display: 'flex' }}>
            <a href="/">HomePage</a> |
            <a href="typer">Typer</a> |
            <a href="dict">Dictionary</a> |
            <a href="progress">Progress</a> |
            <a href="help">Help</a> |
            <a href="user">Account</a> |
            <div>
              <i>{t('title')}</i>
              <select defaultValue={i18n.language} onChange={e => {
                i18n.changeLanguage(e.target.value)
              }}>
                <option key={1} value="en">English</option>
                <option key={2} value="pl">Polski</option>
              </select>
            </div>
            <LazyComponentToTestSuspense />
          </nav>
          <Outlet/>
        </main>
      </AuthProvider>
    </Suspense>
  )
}


export default App
