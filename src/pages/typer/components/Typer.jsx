import { useEffect, useState } from 'react'
import { useBlocker } from 'react-router-dom'

import { useTyperData } from '../../../context/TyperDataContext'

import useMemoWithPreviousValue from '../../../hooks/useMemoWithPreviousValue'
import useCountdown from '../../../hooks/useCountdown'

import Stats from './Stats'
import ProgressBar from './ProgressBar'
import Kana from './Kana'

import { getLetterSpacing, getTextWidth } from '../../../utils/text'
import { LONGEST_LETTER_COUNT_PER_MORAE_ALLOWED } from '../../../utils/kana'
import { createSeededLCGRand } from '../../../utils/rand'

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

  /**
   * Picks a random object from the given map.
   * TODO: function might sometimes not be able to pick any item if we are unlucky enoug, I think...
   * @param {number} amount - how many kana to generate
   * @param {Map<string, Array<{ kana: string }>>} sourceMap - source of random picking
   * @param countingSpecificity - what type of kana counting should be used: 'mora' - counts every single mora in kana string, so that amount is roughly equal to total count of mora in picks; 'morae' - counts every pick to be decremented by 1 from amount
   * @param seed - seed for LCG pseudo-random number generator
   * @param maxNumOfMisses - maximum number of possible misses, after which random-picker loop stops executing
   * @returns {object[]} array of randomly picked objects.
   */
  const getRandomTyperItem = (amount, sourceMap, { countingSpecificity = 'mora', seed = '12345', maxNumOfMisses = 5 } = {}) => {
    console.debug(`generate ${amount} random kana`)

    if (sourceMap === null || sourceMap.size === 0) {
      console.error(`source map is empty - ${sourceMap}`)
      return []
    }

    const rand = createSeededLCGRand(seed)

    const chosen = []
    const choices = Array
      .from(sourceMap.values())
      .flat()

    console.debug(`${amount} to generate, ${choices.length} to pick from`)

    let size = 0
    while (size < amount) {
      const idx = Math.floor(rand() * choices.length)
      const pick = choices[idx]

      if (countingSpecificity === 'mora') {
        if (pick.kana.length + size > amount && maxNumOfMisses > 0) {
          maxNumOfMisses -= 1
          continue
        }
        size += pick.kana.length
      } else {
        size += 1
      }

      chosen.push(pick)
    }

    return chosen
  }

  /**
   * Checks validity of given romaji against source map based on the actual kana (hiragana, katakana or kanji).
   * @param {string} givenRomaji - romaji to check for validity
   * @param {string} targetKana - actual hiragana, katakana or kanji to check against
   * @param {Map<string, Array<{ kana: string }>>} sourceMap - a map of all possible combinations in current typer game
   * @returns {boolean} true if romaji is valid with kana, false if it is not valid or undefined if it could not yet be specified, because of, for example, not yet valid romaji sequence
   */
  const checkMoraRomajiValidity = (givenRomaji, targetKana, sourceMap) => {
    console.debug(`check romaji=${givenRomaji} in target=${targetKana}`)

    // possible longest string one morae combination can create when written in romaji
    if (givenRomaji.length > LONGEST_LETTER_COUNT_PER_MORAE_ALLOWED)
      return false

    const getKana = (key) => sourceMap.get(key)?.map(({ kana }) => kana) || []
    const endsOnVowel = 'aiueo'.split('').some(vowel => givenRomaji.endsWith(vowel))
    const validRomaji = sourceMap.has(givenRomaji)
    const kanaInMap = getKana(givenRomaji).includes(targetKana)

    // romaji ends on vowel - may be valid morae
    if (endsOnVowel && validRomaji)
      return kanaInMap // may be valid but not in map - return inclusion result

    // specific check for n to not conflict with na, ni, etc.
    if (givenRomaji === 'n' && validRomaji && kanaInMap)
      return true

    // romaji might be partial, i.e. user not finished writing it
    return undefined
  }

  const { typerMap, updateTyperMap } = useTyperData()

  const [isLoading, setIsLoading] = useState(true) // kana is loading
  const [isStarted, setIsStarted] = useState(false) // typing started
  const [isFinished, setIsFinished] = useState(false) // typing finished

  const [typerIndex, setTyperIndex] = useState(0) // specifies currently selected morae
  const [userInput, setUserInput] = useState('')
  const [countdown, startCountdown] = useCountdown( // timer for when user it typing
    typerSettings?.time ?? DEFAULT_TIME, 
    () => setIsStarted(true),
    () => setTimeout(() => setIsFinished(true), 1000), // timeout to wait for ProgressBar animation to finish
  )
  const [preCountdown, startPreCountdown] = useCountdown( // timer to get user ready for typing
    3, 
    undefined, 
    () => startCountdown(),
  )
  const [userCorrectHits, setUserCorrectHits] = useState({}) // correct morae
  const [userIncorrectHits, setUserIncorrectHits] = useState({}) // incorrect morae

  const typerData = useMemoWithPreviousValue([], prevValue => {
    if (typerMap === null) {
      console.debug(`typerPool is null - loading`)
      setIsLoading(true)
      return prevValue
    }

    setIsLoading(false)
    console.debug(`typerPool finished loading`)

    const moraWidth = getMoraeWidth('オ')
    const moraToFitOnScreen = Math.ceil(window.innerWidth / (moraWidth + moraeLetterSpacing))

    if (typerIndex === 0) 
      return getRandomTyperItem(moraToFitOnScreen, typerMap)

    const moraeOnRight = prevValue 
      ? prevValue
        .slice(typerIndex)
        .map(({ kana }) => kana)
        .join('')
      : []
    
    const generateMore = moraeOnRight.length < moraToFitOnScreen

    if (prevValue?.length && generateMore)
      return [...prevValue, ...getRandomTyperItem(moraToFitOnScreen, typerMap)]
    return prevValue
  }, [typerMap, typerIndex])

  let blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return isStarted && !isFinished && currentLocation.pathname !== nextLocation.pathname
  })

  const updateUserInput = (e) => {
    console.debug(`update user input`)
    // TODO: set userInput as what they typed and then give them at least 100ms before checking the kana, so that they can glimpse at what they typed into the field

    if (isLoading || isFinished || !isStarted)
      return // block typing on typer loading or timer not yet running or finished

    const text = e.target.value
    const kana = typerData[typerIndex].kana
    const result = checkMoraRomajiValidity(text, kana, typerMap)

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
    if (isFinished)
      toggleFiltersClickability(true)
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