import React, { useEffect, useMemo, useState } from 'react'
import { unicodeToKana, getInputCombinations, checkRomaji, getRandomKana } from '../utils/kana'
import '../css/Typer.css'
import { getTextWidth } from '../utils/text'


function Typer() {
  const [kanaOffset, setKanaOffset] = useState(0)
  const [kanaIndex, setKanaIndex] = useState(0)

  const [visibleKana, setVisibleKana] = useState(getRandomKana(7))
  const [userRomaji, setUserRomaji] = useState('')

  const [score, setScore] = useState({
    accuracy: 0,
    kana: []
  })

  const romajiCombinations = useMemo(() => getInputCombinations(visibleKana[kanaIndex]), [kanaIndex])

  const checkUserRomaji = (e) => {
    // TODO: could use async/await to first make sure that what user typed is actually rendered and then for next render check if it was even correct

    const romaji = e.target.value
    const result = checkRomaji(romaji, romajiCombinations)
    
    if (result !== undefined) {
      setKanaIndex(prevIndex => prevIndex + 1)
      setKanaOffset(prevOffset => {
        const morae = visibleKana[kanaIndex].map(unicodeToKana).join('')
        return prevOffset + getTextWidth(morae, document.querySelector('.kana'))
      })
      setScore(prevScore => ({...prevScore, kana: [...prevScore.kana, result]}))
      setUserRomaji('')
    }
    else {
      setUserRomaji(romaji)
    }
  }

  return (
    <div className='typer'>
      <div className="center-wrapper">
        <div className='kana' style={{ transform: `translateX(-${kanaOffset}px)` }}>
          {visibleKana.map((morae, index) => {
            const moraeText = morae.map(unicodeToKana).join('')
            const style = {}

            if (index === kanaIndex)    // current morae to type
              style.color = 'currentColor'
            else if (index > kanaIndex) // next morae to type
              style.color = 'gray'
            else if (score.kana?.[index] == true)   // previously typed morae correctly // TODO: % 2 only for testing purposes
              style.color = 'lime'
            else                        // previously typed morae incorrectly
              style.color = 'red'

            return (
              <span key={index} style={style}>{moraeText}</span>
            )
          })}
        </div>
        <input type='text' value={userRomaji} onChange={checkUserRomaji} placeholder='type...' />
      </div>
    </div>
  )
}


export default Typer