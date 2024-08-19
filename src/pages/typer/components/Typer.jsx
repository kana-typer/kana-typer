import React, { useEffect, useState, useMemo } from 'react'

import { useTyperData } from '../../../context/TyperDataContext'

import { getTextWidth } from '../../../utils/text'

import '../css/Typer.css'
import { objectsEqual } from '../../../utils/types'
import { getRandomMora } from '../../../utils/kana'

function Typer() {
  const { mora, updateMora } = useTyperData()

  const [typerIndex, setTyperIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [userStats, setUserStats] = useState({})

  const typerData = useMemo(() => {
    if (mora?.filtered !== null)
      return getRandomMora(mora.filtered, { amount: 10 })
    return []
  }, [mora])

  const updateUserInput = (e) => {
    const text = e.target.value

    setUserInput(text)
  }

  useEffect(() => {
    // TODO: example of a slowly generating kana - implement some form of visual loading for such case
    new Promise(resolve => setTimeout(resolve, 3000)).then(() => updateMora())
  }, [])

  return (
    <div className="typer-wrapper">
      <div className='typer'>
        <div 
          className="kana"
          style={{ transform: `translateX(-${0}px)` }}
        >
          {typerData}
        </div>
        <input 
          type="text" 
          value={userInput} 
          onChange={updateUserInput} 
          placeholder='type...'
        />
        <div className="stats">
          <table>
            <tbody>
              <tr>
                <td>Correct</td>
                <td>{0}</td>
              </tr>
              <tr>
                <td>Incorrect</td>
                <td>{0}</td>
              </tr>
              <tr>
                <td>Accuracy</td>
                <td>{0}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Typer