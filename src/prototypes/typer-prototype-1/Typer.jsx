import React, { useState } from 'react'
import { romajiToHiragana } from '../../utils/kana'

function Typer() {
  const [userRomaji, setUserRomaji] = useState()

  return (
    <div>
      <div className="kana">{romajiToHiragana('hayo')}</div>
      <input type="text" value={userRomaji} onChange={setUserRomaji} placeholder='type...' />
    </div>
  )
}

export default Typer