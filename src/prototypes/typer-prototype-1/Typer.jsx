import React, { useEffect, useMemo, useState } from 'react'
import { unicodeToString, stringToUnicode, getInputCombinations, checkRomaji } from '../../utils/kana'

function Typer() {
  const [visibleKana, setVisibleKana] = useState([
    ['304b'],
    ['3063', '3066'],
    ['3061', '3083'],
    ['3093'],
    ['306b', '3083'],
    ['3058'],
  ])
  const [checkingIndex, setCheckingIndex] = useState(2)
  const [userRomaji, setUserRomaji] = useState()
  
  const romajiCombinations = useMemo(() => getInputCombinations(visibleKana[checkingIndex]), [checkingIndex])

  const writeKanaFromArray = () => visibleKana.map(morae => morae.map(unicodeToString).join('')).join('')

  useEffect(() => {
    // romajiToHiragana('kattechannyaji')
    // getInputCombinations('ka', visibleKana[checkingIndex])

    // chijimeru -> ちぢめる
    // tsuzuku -> つづく

    checkRomaji('k', getInputCombinations([stringToUnicode('か')]))
    checkRomaji('ka', getInputCombinations([stringToUnicode('か')]))
    checkRomaji('n', getInputCombinations([stringToUnicode('ん')]))
    checkRomaji('n', getInputCombinations([stringToUnicode('に')]))
    checkRomaji('ni', getInputCombinations([stringToUnicode('に')]))
    checkRomaji('n', getInputCombinations([stringToUnicode('ね')]))
    checkRomaji('ne', getInputCombinations([stringToUnicode('ね')]))
    checkRomaji('t', getInputCombinations([stringToUnicode('つ')]))
    checkRomaji('ts', getInputCombinations([stringToUnicode('つ')]))
    checkRomaji('tsu', getInputCombinations([stringToUnicode('つ')]))
    checkRomaji('j', getInputCombinations([stringToUnicode('じ')]))
    checkRomaji('ji', getInputCombinations([stringToUnicode('じ')]))
    checkRomaji('k', getInputCombinations([stringToUnicode('か')]))
    checkRomaji('e', getInputCombinations([stringToUnicode('か')]))
    checkRomaji('r', getInputCombinations([stringToUnicode('り')]))
    checkRomaji('rn', getInputCombinations([stringToUnicode('り')]))
    checkRomaji('rno', getInputCombinations([stringToUnicode('り')]))
    checkRomaji('q', getInputCombinations([stringToUnicode('て')]))
    checkRomaji('qv', getInputCombinations([stringToUnicode('て')]))
    checkRomaji('qvo', getInputCombinations([stringToUnicode('て')]))
    checkRomaji('qvow', getInputCombinations([stringToUnicode('て')]))
    checkRomaji('qvowa', getInputCombinations([stringToUnicode('て')]))
    checkRomaji('qvowad', getInputCombinations([stringToUnicode('て')]))
    checkRomaji('qvowadi', getInputCombinations([stringToUnicode('て')]))
    checkRomaji('qvowadis', getInputCombinations([stringToUnicode('て')]))
    checkRomaji('qvowadiso', getInputCombinations([stringToUnicode('て')]))
    checkRomaji('qvowadisor', getInputCombinations([stringToUnicode('て')]))
    checkRomaji('qvowadisort', getInputCombinations([stringToUnicode('て')]))

    // checkRomaji('ka', getInputCombinations(['3061', '3083']))
    // checkRomaji('ka', getInputCombinations(['306b', '3083']))
    // checkRomaji('ka', getInputCombinations(['3063', '3066']))
    // checkRomaji('ka', getInputCombinations(['3063', '3061']))
    // checkRomaji('ka', getInputCombinations(['3063', '3061', '3083']))
    // checkRomaji('ka', getInputCombinations(['3063', '306b', '3083']))
  }, [])

  return (
    <div>
      <div className="kana">{writeKanaFromArray()}</div>
      <input type="text" value={userRomaji} onChange={setUserRomaji} placeholder='type...' />
    </div>
  )
}

export default Typer