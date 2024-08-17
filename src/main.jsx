import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './config/i18n.js'

import App from './App.jsx'
import HomePage from './pages/home/HomePage.jsx'
import TyperPage from './pages/typer/TyperPage.jsx'
import ProgressPage from './pages/progress/ProgressPage.jsx'
import HelpPage from './pages/help/HelpPage.jsx'
import UserPage from './pages/user/UserPage.jsx'
import ErrorPage from './pages/error/ErrorPage.jsx'

import './css/main.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: process.env.NODE_ENV === 'development' ? null : <ErrorPage />, // disabled custom error page in dev, as default one may show useful debug info
    children: [
      {
        path: 'help',
        element: <HelpPage/>,
      },
      {
        index: true,
        element: <HomePage/>,
      },
      {
        path: 'progress',
        element: <ProgressPage/>,
      },
      {
        path: 'typer',
        element: <TyperPage/>,
      },
      {
        path: 'user',
        element: <UserPage/>,
      }
    ]
  }
])



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
