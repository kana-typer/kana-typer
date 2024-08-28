import React, { useEffect, useState } from 'react'

import { useTyperData } from '../../../context/TyperDataContext'

import useMemoWithPreviousValue from '../../../hooks/useMemoWithPreviousValue'
import useTimer from '../../../hooks/useTimer'

import Stats from './Stats'
import ProgressBar from './ProgressBar'
import Kana from './Kana'

import { getLetterSpacing, getTextWidth } from '../../../utils/text'
import { checkRomajiValidity, getRandomMora } from '../../../utils/kana'

import '../css/Typer.css'

function Typer() {
  const moraeLetterSpacing = getLetterSpacing(
    document.querySelector('.morae__symbol') || document.body
  )
  const getMoraeWidth = (morae) => getTextWidth(
    morae, 
    document.querySelector('.kana') || document.body, 
    moraeLetterSpacing,
  )

  const { mora, updateMora, updateUserData } = useTyperData()

  const [isLoading, setIsLoading] = useState(true) // kana is loading
  const [isStarted, setIsStarted] = useState(false) // typing started
  const [isFinished, setIsFinished] = useState(false) // typing finished

  const [typerIndex, setTyperIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [timer, startTimer] = useTimer(60, () => setIsStarted(true), () => setIsFinished(true))
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

    const moraWidth = getMoraeWidth('オ')
    const moraToFitOnScreen = Math.ceil(window.innerWidth / (moraWidth + moraeLetterSpacing))

    if (typerIndex === 0) 
      return getRandomMora(mora, { amount: moraToFitOnScreen })

    const moraeOnRight = prevValue 
      ? prevValue
        .slice(typerIndex)
        .map(({ symbol }) => symbol)
        .join('')
      : []
    
    const generateMore = moraeOnRight.length < moraToFitOnScreen

    if (prevValue?.length && generateMore)
      return [...prevValue, ...getRandomMora(mora, { amount: moraToFitOnScreen })]
    return prevValue
  }, [mora, typerIndex])

  const updateUserInput = (e) => {
    // TODO: set userInput as what they typed and then give them at least 100ms before checking the kana, so that they can glimpse at what they typed into the field

    if (isLoading || isFinished || !isStarted)
      return // block typing on typer loading or timer not yet running or finished

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
    <div className='typer-wrapper'>
      <div className='typer'>
        <Kana 
          typerIndex={typerIndex}
          typerData={typerData}
          userStats={userStats}
          getMoraeWidth={getMoraeWidth}
        />
        <input 
          type='text' 
          value={userInput} 
          onChange={updateUserInput} 
          placeholder='type...'
        />
      </div>
      <ProgressBar timer={timer} maxTimer={60} isFinished={isFinished} />
      <Stats stats={userStats} />
      <button onClick={startTimer}>Start</button>
    </div>
  )
}

export default Typer