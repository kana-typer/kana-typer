import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { app as firebaseApp } from './config/firebase'


function App() {
    console.log(firebaseApp)

    return (<>
        <h1>Kana Typer Test</h1>
    </>)
}


export default App
