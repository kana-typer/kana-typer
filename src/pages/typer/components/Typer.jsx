import React, { useEffect, useState, useMemo, useRef } from 'react'

import { useTyperData } from '../../../context/TyperDataContext'

import useMemoWithPreviousValue from '../../../hooks/useMemoWithPreviousValue'

import { getLetterSpacing, getTextWidth } from '../../../utils/text'
import { checkRomajiValidity, getRandomMora } from '../../../utils/kana'

import '../css/Typer.css'
import useWindowResize from '../../../hooks/useWindowResize'

function Typer() {
  const getMoraeLetterSpacing = getLetterSpacing(document.querySelector('.morae__symbol') || document.body)
  const getMoraeWidth = (morae) => getTextWidth(
    morae, 
    document.querySelector('.kana') || document.body, 
    getMoraeLetterSpacing,
  )

  const { mora, updateMora, updateUserData } = useTyperData()

  const [isLoading, setIsLoading] = useState(true)
  const [typerIndex, setTyperIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [userStats, setUserStats] = useState({
    correct: {},
    incorrect: {},
  })

  const typerData = useMemoWithPreviousValue([], prevValue => {
    if (mora === null) {
      setIsLoading(true)
      return prevValue
    }

    setIsLoading(false)

    if (typerIndex === 0) 
      return getRandomMora(mora, { amount: 20 })

    const moraWidth = getMoraeWidth('オ')
    const moraToFitOnScreen = Math.ceil(window.innerWidth / (moraWidth + getMoraeLetterSpacing))
    const moraeOnRight = prevValue 
      ? prevValue
        .slice(typerIndex)
        .map(({ symbol }) => symbol)
        .join('')
      : []
    
    const generateMore = moraeOnRight.length < moraToFitOnScreen

    if (prevValue?.length && generateMore)
      return [...prevValue, ...getRandomMora(mora, { amount: 20 })]
    
    return prevValue
  }, [mora, typerIndex])

  const transformOffset = useMemo(() => {
    const moraeOnTheLeft = typerData
      .slice(0, typerIndex)
      .map(({ symbol }) => symbol)
      .join('')
    return getMoraeWidth(moraeOnTheLeft)
  }, [typerIndex])

  const updateUserInput = (e) => {
    if (isLoading)
      return // block typing on typer loading

    const text = e.target.value
    const symbol = typerData[typerIndex].symbol
    const result = checkRomajiValidity(text, symbol, mora)

    if (result === undefined)
      return setUserInput(text)

    setTyperIndex(prevIndex => prevIndex + 1)
    setUserInput('')
    setUserStats(prevStats => {
      prevStats[result ? 'correct' : 'incorrect'][typerIndex] = symbol
      return prevStats
    })
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
          style={{ transform: `translateX(-${transformOffset}px)` }}
        >
          {typerData.map(({ symbol, furigana }, index) => {
            const translation = index % 2 == 0 ? ' ' : 'text text' // TODO: if translation is too long, it breaks the width of the .morae box
            let colorClassName = ''

            if (index === typerIndex)
              colorClassName = 'current'
            
            if (index < typerIndex) {
              if (userStats.correct?.[index])
                colorClassName = 'correct'
              if (userStats.incorrect?.[index])
                colorClassName = 'incorrect'
            }

            return (
              <span key={index} className={`morae ${colorClassName}`}>
                <i className='morae__furigana'>{furigana}</i>
                <hr />
                <i className='morae__translation'>{translation}</i>
                <span className='morae__symbol'>{symbol}</span>
              </span>
            )
          })}
        </div>
        <input 
          type="text" 
          value={userInput} 
          onChange={updateUserInput} 
          placeholder='type...'
        />
      </div>
      <div className="stats">
        <table>
          <tbody>
            <tr>
              <td>Correct</td>
              <td>{Object.values(userStats.correct).length}</td>
            </tr>
            <tr>
              <td>Incorrect</td>
              <td>{Object.values(userStats.incorrect).length}</td>
            </tr>
            <tr>
              <td>Accuracy</td>
              <td>{0}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Typer