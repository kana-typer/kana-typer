import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './css/App.css'


function App() {
  const { i18n, t } = useTranslation()

  return (
    <Suspense fallback='loading'>
      <main>
        <nav>
          <a href="/">HomePage</a> |
          <a href="typer">Typer</a> |
          <a href="dict">Dictionary</a> |
          <a href="progress">Progress</a> |
          <a href="help">Help</a> |
          <a href="user">Account</a> |
          <div>
            <h1>{t('title')}</h1>
            <select defaultValue={i18n.language} onChange={e => {
              i18n.changeLanguage(e.target.value)
            }}>
              <option key={1} value="en">English</option>
              <option key={2} value="pl">Polski</option>
            </select>
          </div>
        </nav>
        <Outlet/>
      </main>
    </Suspense>
  )
}


export default App
