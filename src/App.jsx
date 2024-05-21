import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { app as firebaseApp } from './config/firebase'
import Typer from './prototypes/typer-prototype-1/Typer'


function App() {
  console.log(firebaseApp)

  return (
    <>
      <Typer />
    </>
  )
}


export default App
