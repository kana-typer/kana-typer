import { useEffect, useMemo, useRef, useState } from 'react'
import { useBlocker } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'

import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

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
  const initTimer = useMemo(() => typerSettings?.time !== 0, [typerSettings.time]) // if time = 0, timer should not be running

  const [typerIndex, setTyperIndex] = useState(0) // specifies currently selected morae
  const [userInput, setUserInput] = useState('')
  const userInputRef = useRef(null)
  const [preCountdown, startPreCountdown] = useCountdown( // timer to get user ready for typing
    4, 
    undefined, 
    () => startCountdown(),
  )
  const [countdown, startCountdown] = useCountdown( // timer for when user it typing
    typerSettings?.time ?? DEFAULT_TIME, 
    () => setIsStarted(true),
    initTimer 
      ? () => setTimeout(() => setIsFinished(true), 1000) // timeout to wait for ProgressBar animation to finish
      : undefined, // do not ever set isFinished state if timer should not be initialized, i.e. typerSettings.time was set to 0
  )
  const [userCorrectHits, setUserCorrectHits] = useState({}) // correct morae
  const [userIncorrectHits, setUserIncorrectHits] = useState({}) // incorrect morae
  const userHitsRef = useRef({ correct: userCorrectHits, incorrect: userIncorrectHits }) // used for updating user progress after component unmount (leaving typer)

  const typerData = useMemoWithPreviousValue([], prevValue => {
    if (typerMap === null) {
      setIsLoading(true)
      return prevValue
    }

    setIsLoading(false)

    const moraWidth = getMoraeWidth('オ')
    const moraToFitOnScreen = Math.ceil(window.innerWidth / (moraWidth + moraeLetterSpacing))

    if (typerIndex === 0) 
      return getRandomKanaFromMap(moraToFitOnScreen, typerMap, { seed: Date.now() })

    const moraeOnRight = prevValue 
      ? prevValue
        .slice(typerIndex)
        .map(({ kana }) => kana)
        .join('')
      : []
    
    const generateMore = moraeOnRight.length < moraToFitOnScreen

    if (prevValue?.length && generateMore)
      return [...prevValue, ...getRandomKanaFromMap(moraToFitOnScreen, typerMap, { seed: Date.now() })]
    return prevValue
  }, [typerMap, typerIndex])

  let blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return isStarted && !isFinished && currentLocation.pathname !== nextLocation.pathname
  })

  const updateUserInput = (e) => {
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
    userHitsRef.current = { correct: userCorrectHits, incorrect: userIncorrectHits }
  }, [userCorrectHits, userIncorrectHits])

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

    if (!initTimer) {
      toggleFiltersClickability(true)
    }
  }, [isStarted, initTimer])

  useEffect(() => {
    if (isFinished) {
      toggleFiltersClickability(true)
      updateUserProgress(userCorrectHits, userIncorrectHits)
    }
  }, [isFinished])

  useEffect(() => () => {
    if (!initTimer) {
      updateUserProgress(userHitsRef.current.correct, userHitsRef.current.incorrect)
    }
  }, [])

  return (
    <div className='typer-wrapper'>
      <div className="typer-mask">
        <div className='typer'>
          <Kana 
            isLoading={isLoading}
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
            placeholder={t('typerDetails.type')}
          />
        </div>
      </div>
      {initTimer && <ProgressBar 
        timer={countdown} 
        maxTimer={typerSettings?.time ?? DEFAULT_TIME} 
        isFinished={isFinished} 
      />}
      <Stats 
        correctHits={userCorrectHits}
        incorrectHits={userIncorrectHits}
        isStarted={isStarted} 
        isFinished={isFinished} 
      />
      <div className={`pre-countdown ${isStarted ? 'hidden' : ''}`}>
        {isLoading ? <FontAwesomeIcon icon={faSpinner} className='spinner' /> : preCountdown}
      </div>
      {blocker.state === 'blocked' ? (
        <div className='typer-page__modal'>
          <div className='typer-page__button-box'>
            <p className='typer-page__question'>{t('customizeDetails.timerLeave')}</p>
            <button className='typer-page__leave btn' onClick={() => blocker.proceed()}>{t('customizeDetails.timerLeaveYes')}</button>
            <button className='typer-page__cancel btn btn-alt-1' onClick={() => blocker.reset()}>{t('customizeDetails.timerLeaveNo')}</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Typer