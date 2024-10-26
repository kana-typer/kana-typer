import { useMemo } from 'react'

import '../css/Kana.css'

function Kana({
  typerIndex, 
  typerData, 
  correctHits,
  incorrectHits,
  getMoraeWidth,
}) {
  const transformOffset = useMemo(() => {
    const moraeOnTheLeft = typerData
      .slice(0, typerIndex)
      .map(({ kana }) => kana)
      .join('')
    return getMoraeWidth(moraeOnTheLeft)
  }, [typerIndex])

  return (
    <div 
      className='kana'
      style={{ transform: `translateX(-${transformOffset}px)` }}
    >
      {typerData.map(({ kana, furigana }, index) => {
        const translation = index % 2 == 0 ? ' ' : 'text text' // TODO: if translation is too long, it breaks the width of the .morae box
        let colorClassName = ''

        if (index === typerIndex)
          colorClassName = 'current'
        
        if (index < typerIndex) {
          if (correctHits?.[index])
            colorClassName = 'correct'
          if (incorrectHits?.[index])
            colorClassName = 'incorrect'
        }

        return (
          <span key={index} className={`morae ${colorClassName}`}>
            <i className='morae__furigana'>{furigana}</i>
            <hr />
            <i className='morae__translation'>{translation}</i>
            <span className='morae__symbol'>{kana}</span>
          </span>
        )
      })}
    </div>
  )
}

export default Kana