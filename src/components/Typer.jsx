import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { unicodeToKana, getInputCombinations, checkRomaji, getRandomKana } from '../utils/kana'
import '../css/Typer.css'
import { getTextWidth } from '../utils/text'
import useWindowResize from '../hooks/useWindowResize'


function Typer() {
  const getMoraeWidth = (morae) => getTextWidth(morae, document.querySelector('.kana') || document.body)

  const [kanaOffset, setKanaOffset] = useState(0) // how many previous morae to skip
  const [kanaIndex, setKanaIndex] = useState(0) // currently selected morae
  const [kanaData, setKanaData] = useState([
    ['304b'],         // か
    ['3063', '3066'], // って
    ['3061', '3083'], // ちゃ
    ['3093'],         // ん
    ['306b', '3083'], // にゃ
    ['3058'],         // じ
  ])
  const [kanaStats, setKanaStats] = useState({
    correct: []
  })
  const [userRomaji, setUserRomaji] = useState('')

  // const transformOffsetRef = useRef(0)
  // const transformOffset = useMemo(() => {
  //   const index = kanaOffset - 1

  //   if (index < 0)
  //     return 0

  //   const morae = kanaData[index]?.map(unicodeToKana)?.join('')
  //   const addition = morae === undefined ? 0 : getMoraeWidth(morae)

  //   transformOffsetRef.current += addition
  //   return transformOffsetRef.current
  // }, [kanaOffset])

  // const transformOffset = useMemoWithRollback(0, (rollback) => {
  //   const index = kanaOffset - 1
  //   if (index < 0)
  //     return 0
    
  //   const morae = kanaData[index]?.map(unicodeToKana)?.join('')
  //   const addition = morae === undefined ? 0 : getMoraeWidth(morae)

  //   rollback.current += addition
  //   return rollback.current
  // }, [kanaIndex])

  const romajiCombinations = useMemo(() => getInputCombinations(kanaData[kanaIndex]), [kanaIndex])

  // const kanaOffset = useMemoWithRollback(0, rollback => {
  //   const bulkSize = 10

  //   const offset = rollback + (rollback * 2 === kanaStats.correct.length)

  //   return { memo: offset, rollback }
  // }, [kanaIndex])

  const kanaDataToRender = useMemo(() => kanaData.slice(kanaOffset), [kanaOffset])

  const kanaTransformOffset = useMemo(() => {
    const morae = kanaDataToRender
      .slice(0, kanaIndex)
      .map(morae => morae.map(unicodeToKana).join('')).join('')
    return getMoraeWidth(morae)
  }, [kanaIndex, kanaDataToRender])

  const shiftKana = () => {

  }

  const appendKanaIfPossible = () => {
    const moraWidth = getMoraeWidth(unicodeToKana('3042'))
    const moraeAmount = Math.ceil(window.innerWidth / 2 / moraWidth)
    console.log('ap', kanaData.length, '>', kanaIndex + 3)

    if (kanaData.length > kanaIndex + 3) // enough morae at rear to not generate new 
      return
    
    console.log('ap', true)
    // const rearMorae = kanaData
    //   .slice(kanaIndex)
    //   .map(morae => morae.map(unicodeToKana).join('')).join('')

    setKanaData(prev => [...prev, ...getRandomKana(moraeAmount)])
  }

  const checkUserRomaji = (e) => {
    // TODO: could use async/await to first make sure that what user typed is actually rendered and then for next render check if it was even correct

    const romaji = e.target.value
    const result = checkRomaji(romaji, romajiCombinations)

    if (result !== undefined) {
      setKanaIndex(prevIndex => prevIndex + 1)
      setKanaStats(prevStats => ({ ...prevStats, correct: [...prevStats.correct, result] }))
      setUserRomaji('')

      // const isSpaceForMoreKana = 

      // if (kanaIndex + 3 > kanaData.length)
      appendKanaIfPossible()
    }
    else {
      setUserRomaji(romaji)
    }
  }

  useEffect(() => {
    
  }, [])

  return (
    <div className='typer'>
      <div className="center-wrapper">
        <div 
          className='kana' 
          style={{ transform: `translateX(-${kanaTransformOffset}px)` }}
        >
          {kanaDataToRender.map((morae, index) => {
            const moraeText = morae.map(unicodeToKana).join('')
            const style = {}

            if (index === kanaIndex)    // current morae to type
              style.color = 'currentColor'
            else if (index > kanaIndex) // next morae to type
              style.color = 'gray'
            else if (kanaStats.correct?.[index] == true)   // previously typed morae correctly // TODO: % 2 only for testing purposes
              style.color = 'lime'
            else                        // previously typed morae incorrectly
              style.color = 'red'

            return (
              <span 
                key={index} 
                style={style}
              >{moraeText}</span>
            )
          })}
        </div>
        <input 
          type='text' 
          value={userRomaji} 
          onChange={checkUserRomaji} 
          placeholder='type...' 
        />
      </div>
    </div>
  )
}


export default Typer