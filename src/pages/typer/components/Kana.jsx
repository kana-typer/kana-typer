import { useMemo } from 'react'

import '../css/Kana.css'

function Kana({
  isLoading,
  typerIndex, 
  typerData, 
  correctHits,
  incorrectHits,
  getMoraeWidth,
}) {
  if (isLoading)
    typerData = [{
      kana: '「Kana Typer」',
      furigana: '...',
      translation: '...',
    }]

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
      {typerData.map(({ kana, furigana, reading, translation }, index) => {
        const fullFurigana = reading ? `${furigana} (${reading})` : furigana
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
          <span key={index} className={`morae ${colorClassName}`} style={{ '--kana-width': `${getMoraeWidth(kana)}px` }}>
            <i className='morae__furigana'>{fullFurigana}</i>
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