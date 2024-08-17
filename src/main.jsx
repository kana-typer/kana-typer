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
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage/>,
      },
      {
        path: 'typer',
        element: <TyperPage/>,
      },
      {
        path: 'progress',
        element: <ProgressPage/>,
      },
      {
        path: 'help',
        element: <HelpPage/>,
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
