import React, { useMemo, useState, useEffect } from 'react'
import { unicodeToKana, getInputCombinations, checkRomaji, getRandomKana } from '../../utils/kana.old'
import { getTextWidth } from '../../utils/text'
import '../../css/Typer.old.css'


function Typer() {
  const getMoraeWidth = (morae) => getTextWidth(morae, document.querySelector('.kana') || document.body)

  // TODO: unused for now, because shiftingKana is not implemented
  const [kanaOffset, setKanaOffset] = useState(0) // how many previous morae to skip 
  const [kanaIndex, setKanaIndex] = useState(0) // currently selected morae
  const [kanaData, setKanaData] = useState([])
  const [kanaStats, setKanaStats] = useState({
    correct: []
  })
  const [userRomaji, setUserRomaji] = useState('')

  const romajiCombinations = useMemo(() => getInputCombinations(kanaData?.[kanaIndex] || []), [kanaData, kanaIndex])
  const kanaDataToRender = useMemo(() => kanaData.slice(kanaOffset), [kanaData, kanaOffset])
  const kanaTransformOffset = useMemo(() => {
    const morae = kanaDataToRender
      .slice(0, kanaIndex)
      .map(morae => morae.map(unicodeToKana).join('')).join('')
    return getMoraeWidth(morae)
  }, [kanaIndex, kanaDataToRender])

  const shiftKana = () => {
    // TODO: performance was dropping only close to 150k pixels moved, thus not needed
  }

  const appendKanaIfPossible = () => {
    const moraWidth = getMoraeWidth(unicodeToKana('3042'))
    const moraeAmount = Math.ceil(window.innerWidth / 2 / moraWidth)
    const rearMorae = kanaData
      .slice(kanaIndex)
      .map(morae => morae.map(unicodeToKana).join('')).join('')

    // amount of morae to still be out of view for new to be generated
    const moraeBuffer = 10 

    // minimum amount of morae after currently selected one
    const minMoraeAtRear = 3

    // failsafe to generate morae with always few left at rear
    const failsafe = kanaData.length < kanaIndex + minMoraeAtRear

    // half-screen width + buffer has to more than current rear morae amount to generate new morae, e.g.:
    // |----------------| half-screen width + morae
    // |------------| rear morae
    // if that fails, checks failsafe too to never have less than specific amount of morae at rear
    if (moraeAmount + moraeBuffer > rearMorae.length || failsafe)
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
      appendKanaIfPossible()
    }
    else {
      setUserRomaji(romaji)
    }
  }

  useEffect(() => {
    console.log('Kana data:', kanaData);
    console.log('Kana index:', kanaIndex);
    console.log('User Romaji:', userRomaji);
    appendKanaIfPossible();
  }, []);
  

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

            if (index === kanaIndex) // current morae to type
              style.color = 'currentColor'
            else if (index > kanaIndex) // next morae to type
              style.color = 'gray'
            else if (kanaStats.correct?.[index] == true) // previously typed morae correctly
              style.color = 'lime'
            else // previously typed morae incorrectly
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
      <div className="stats">
        <table>
          <tbody>
            <tr>
              <td>Correct</td>
              <td>{kanaStats.correct.filter(x => x === true).length}</td>
            </tr>
            <tr>
              <td>Incorrect</td>
              <td>{kanaStats.correct.filter(x => x === false).length}</td>
            </tr>
            <tr>
              <td>Accuracy</td>
              <td>{(kanaStats.correct.filter(x => x === true).length / (kanaStats.correct.length || 1)).toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}


export default Typer