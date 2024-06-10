import React, { useEffect, useMemo, useState } from 'react'
import { unicodeToKana, getInputCombinations } from '../../utils/kana'

function Typer() {
  const [visibleKana, setVisibleKana] = useState([
    ['304b'],         // か
    ['3063', '3066'], // って
    ['3061', '3083'], // ちゃ
    ['3093'],         // ん
    ['306b', '3083'], // にゃ
    ['3058'],         // じ
  ])
  const [checkingIndex, setCheckingIndex] = useState(2) // kana in visibleKana we highlight for user to type out
  const [userRomaji, setUserRomaji] = useState()
  
  const romajiCombinations = useMemo(() => getInputCombinations(visibleKana[checkingIndex]), [checkingIndex])

  return (
    <div>
      <div className="kana">{visibleKana.map(morae => morae.map(unicodeToKana).join('')).join('')}</div>
      <input type="text" value={userRomaji} onChange={setUserRomaji} placeholder='type...' />
    </div>
  )
}

export default Typer