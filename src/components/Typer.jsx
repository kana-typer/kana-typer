import React, { useEffect, useMemo, useState } from 'react'
import { unicodeToKana, getInputCombinations, checkRomaji, getRandomKana } from '../utils/kana'
import '../css/Typer.css'
import { getTextWidth } from '../utils/text'


function Typer() {
  const [kanaDictionaryRaw, setKanaDictionaryRaw] = useState({
    morae: {
      hiragana: {
        count: {
          start: '3041',
          end: '3093',
          length: 83
        },
        array: [
          'xa',   'a',              'xi', 'i',                'xu',     'u',                'xe', 'e',              'xo',   'o',
                  'ka', 'ga',             'ki',   'gi',                 'ku',   'gu',             'ke', 'ge',               'ko', 'go',
                  'sa', 'za',             'shi',  'ji',                 'su',   'zu',             'se', 'ze',               'so', 'zo',
                  'ta', 'da',             'chi',  'ji',       'xtsu',   'tsu',  'zu',             'te', 'de',               'to', 'do',
                  'na',                   'ni',                         'nu',                     'ne',                     'no', 
                  'ha', 'ba', 'pa',       'hi',   'bi', 'pi',           'fu',   'bu', 'pu',       'he', 'be', 'pe',         'ho', 'bo', 'po',
                  'ma',                   'mi',                         'mu',                     'me',                     'mo', 
          'xya',  'ya',                                       'xyu',    'yu',                                       'xyo',  'yo',
                  'ra',                   'ri',                         'ru',                     're',                     'ro',
          'xwa',  'wa',                   'wi',                                                   'we',                     'wo',
          'n'
        ],
        except: ['xa', 'xi', 'xu', 'xe', 'xo', 'xwa', 'wi', 'we'],
      },
      katakana: {},
    },
    words: {
      hiragana: {},
      katakan: {},
      kanji: {},
    }
  })

  const [kanaOffset, setKanaOffset] = useState(0)
  const [kanaIndex, setKanaIndex] = useState(0)
  // const [visibleKana, setVisibleKana] = useState([
  //   ['304b'],         // か
  //   ['3063', '3066'], // って
  //   ['3061', '3083'], // ちゃ
  //   ['3093'],         // ん
  //   ['306b', '3083'], // にゃ
  //   ['3058'],         // じ
  // ])
  const [visibleKana, setVisibleKana] = useState(getRandomKana(7))
  const [score, setScore] = useState({
    accuracy: 0,
    kana: []
  })

  const romajiCombinations = useMemo(() => getInputCombinations(visibleKana[kanaIndex]), [kanaIndex])

  const [userRomaji, setUserRomaji] = useState('')

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