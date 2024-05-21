import React, { useState } from 'react'

function Typer() {
  const [userRomaji, setUserRomaji] = useState()

  return (
    <div>
      <div className="kana">hiragana</div>
      <input type="text" value={userRomaji} onChange={setUserRomaji} placeholder='type...' />
    </div>
  )
}

export default Typer