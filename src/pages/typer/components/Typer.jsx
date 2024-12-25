import { useEffect, useRef, useState } from 'react'
import { useBlocker } from 'react-router-dom'

import { useTyperData } from '../../../context/TyperDataContext'

import useMemoWithPreviousValue from '../../../hooks/useMemoWithPreviousValue'
import useCountdown from '../../../hooks/useCountdown'

import Stats from './Stats'
import ProgressBar from './ProgressBar'
import Kana from './Kana'

import { getLetterSpacing, getTextWidth } from '../../../utils/text'
import { checkRomajiValidityOfKana, getRandomKanaFromMap } from '../../../utils/kana'

import '../css/Typer.css'

const DEFAULT_TIME = 12

function Typer({ typerSettings, toggleFiltersClickability }) {
  // JSDOM-specific functions that need to be regenerated every time, sadly
  // TODO: find a fix for this - regenerating function definitions every time is unoptimized
  const moraeLetterSpacing = getLetterSpacing(
    document.querySelector('.morae__symbol') || document.body
  )
  const getMoraeWidth = (morae) => getTextWidth(
    morae, 
    document.querySelector('.kana') || document.body, 
    moraeLetterSpacing,
  )

  const { typerMap, updateTyperMap, updateUserProgress } = useTyperData()

  const [isLoading, setIsLoading] = useState(true) // kana is loading
  const [isStarted, setIsStarted] = useState(false) // typing started
  const [isFinished, setIsFinished] = useState(false) // typing finished

  const [typerIndex, setTyperIndex] = useState(0) // specifies currently selected morae
  const [userInput, setUserInput] = useState('')
  const userInputRef = useRef(null)
  const [preCountdown, startPreCountdown] = useCountdown( // timer to get user ready for typing
    3, 
    undefined, 
    () => startCountdown(),
  )
  const [countdown, startCountdown] = useCountdown( // timer for when user it typing
    typerSettings?.time ?? DEFAULT_TIME, 
    () => setIsStarted(true),
    () => setTimeout(() => setIsFinished(true), 1000), // timeout to wait for ProgressBar animation to finish
  )
  const [userCorrectHits, setUserCorrectHits] = useState({}) // correct morae
  const [userIncorrectHits, setUserIncorrectHits] = useState({}) // incorrect morae

  const typerData = useMemoWithPreviousValue([], prevValue => {
    if (typerMap === null) {
      // // console.debug(`typerPool is null - loading`)
      setIsLoading(true)
      return prevValue
    }

    setIsLoading(false)
    // // console.debug(`typerPool finished loading`)

    const moraWidth = getMoraeWidth('オ')
    const moraToFitOnScreen = Math.ceil(window.innerWidth / (moraWidth + moraeLetterSpacing))

    if (typerIndex === 0) 
      return getRandomKanaFromMap(moraToFitOnScreen, typerMap)

    const moraeOnRight = prevValue 
      ? prevValue
        .slice(typerIndex)
        .map(({ kana }) => kana)
        .join('')
      : []
    
    const generateMore = moraeOnRight.length < moraToFitOnScreen

    if (prevValue?.length && generateMore)
      return [...prevValue, ...getRandomKanaFromMap(moraToFitOnScreen, typerMap)]
    return prevValue
  }, [typerMap, typerIndex])

  let blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return isStarted && !isFinished && currentLocation.pathname !== nextLocation.pathname
  })

  const updateUserInput = (e) => {
    // // console.debug(`update user input`)
    // TODO: set userInput as what they typed and then give them at least 100ms before checking the kana, so that they can glimpse at what they typed into the field

    if (isLoading || isFinished || !isStarted)
      return // block typing on typer loading or timer not yet running or finished

    const text = e.target.value
    const kana = typerData[typerIndex].kana
    const result = checkRomajiValidityOfKana(text.toLowerCase(), kana, typerMap)

    if (result === undefined)
      return setUserInput(text)

    setTyperIndex(prevIndex => prevIndex + 1)
    setUserInput('')

    if (result === true)
      setUserCorrectHits(prev => ({
        ...prev,
        [typerIndex]: kana,
      }))
    else if (result === false)
      setUserIncorrectHits(prev => ({
        ...prev,
        [typerIndex]: kana,
      }))
  }

  useEffect(() => {
    // TODO: example of a slowly generating kana - implement some form of visual loading for such case
    new Promise(resolve => setTimeout(resolve, 3000)).then(() => updateTyperMap())
  }, [])

  useEffect(() => {
    if (!isLoading) {
      toggleFiltersClickability(false)
      startPreCountdown()
    }
  }, [isLoading])

  useEffect(() => {
    if (isStarted) {
      userInputRef.current.focus()
    }
  }, [isStarted])

  useEffect(() => {
    if (isFinished) {
      toggleFiltersClickability(true)
      updateUserProgress(userCorrectHits, userIncorrectHits)
    }
  }, [isFinished])

  return (
    <div className='typer-wrapper'>
      <div className='typer'>
        <Kana 
          typerIndex={typerIndex}
          typerData={typerData}
          correctHits={userCorrectHits}
          incorrectHits={userIncorrectHits}
          getMoraeWidth={getMoraeWidth}
        />
        <input 
          ref={userInputRef}
          type='text' 
          value={userInput} 
          onChange={updateUserInput} 
          placeholder='type...'
        />
      </div>
      <ProgressBar 
        timer={countdown} 
        maxTimer={typerSettings?.time ?? DEFAULT_TIME} 
        isFinished={isFinished} 
      />
      <Stats 
        correctHits={userCorrectHits}
        incorrectHits={userIncorrectHits}
        isStarted={isStarted} 
        isFinished={isFinished} 
      />
      <div className={`pre-countdown ${isStarted ? 'hidden' : ''}`}>
        {isLoading ? 'Loading' : preCountdown + 1}
      </div>
      {blocker.state === 'blocked' ? (
        <div>
          <p>Are you sure you want to leave?</p>
          <button onClick={() => blocker.proceed()}>Leave</button>
          <button onClick={() => blocker.reset()}>Cancel</button>
        </div>
      ) : null}
    </div>
  )
}

export default Typer