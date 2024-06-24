
import React, { useEffect, useMemo, useState } from 'react'
import { unicodeToKana, getInputCombinations } from '../utils/kana'


function Typer() {
  const [kanaDictionaryRaw, setKanaDictionaryRaw] = useState({
    morae: {
      hiragana: {
        count: {
          start: "3041",
          end: "3093",
          length: 83
        },
        array: [
          "xa",   "a",              "xi", "i",                "xu",     "u",                "xe", "e",              "xo",   "o",
                  "ka", "ga",             "ki",   "gi",                 "ku",   "gu",             "ke", "ge",               "ko", "go",
                  "sa", "za",             "shi",  "ji",                 "su",   "zu",             "se", "ze",               "so", "zo",
                  "ta", "da",             "chi",  "ji",       "xtsu",   "tsu",  "zu",             "te", "de",               "to", "do",
                  "na",                   "ni",                         "nu",                     "ne",                     "no", 
                  "ha", "ba", "pa",       "hi",   "bi", "pi",           "fu",   "bu", "pu",       "he", "be", "pe",         "ho", "bo", "po",
                  "ma",                   "mi",                         "mu",                     "me",                     "mo", 
          "xya",  "ya",                                       "xyu",    "yu",                                       "xyo",  "yo",
                  "ra",                   "ri",                         "ru",                     "re",                     "ro",
          "xwa",  "wa",                   "wi",                                                   "we",                     "wo",
          "n"
        ],
        except: ["xa", "xi", "xu", "xe", "xo", "xwa", "wi", "we"],
      },
      katakana: {},
    },
    words: {
      hiragana: {},
      katakan: {},
      kanji: {},
    }
  })

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