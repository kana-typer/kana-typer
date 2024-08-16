import AuthProvider from './context/AuthContext'
import Typer from './components/Typer'
import Tester from './components/Tester'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './css/App.css'


function App() {
  return (
    <AuthProvider>
      <span className='vl'></span>
      <Tester />
      <Typer />
    </AuthProvider>
  )
}


export default App
