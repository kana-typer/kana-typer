import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import TyperPage from './pages/TyperPage.jsx'
import Dictionary from './pages/Dictionary.jsx'
import UserProgress from './pages/UserProgress.jsx'
import Help from './pages/Help.jsx'
import UserPage from './pages/UserPage.jsx'


import './css/main.css'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <p>ERROR</p>,
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
        path: 'dict',
        element: <Dictionary/>,
      },
      {
        path: 'progress',
        element: <UserProgress/>,
      },
      {
        path: 'help',
        element: <Help/>,
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
