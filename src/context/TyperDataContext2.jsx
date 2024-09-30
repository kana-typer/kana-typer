import { createContext, useContext, useState } from 'react'
import { collection, getDocs, query } from 'firebase/firestore'

import { db } from '../config/firebase'

import { MORA_SCRIPTS, MORA_TYPES, WORDS_CATEGORIES, WORDS_TYPES } from '../utils/kana'
import { objectsEqual } from '../utils/types'

const TyperDataContext = createContext()

export const useTyperData = () => useContext(TyperDataContext)

export default function TyperDataProvider({ children }) {
  const [filtersMora, setFiltersMora] = useState({
    use: false,
    scripts: [], // MORA_SCRIPTS, non-empty
    types: [], // MORA_TYPES, non-empty
    extended: true, // only for katakana, e.g. che, ti, tsa
    sokuon: true, // e.g. kka, dde, hhya
    yoon: true, // e.g. kya, ju, hhyo
  })
  const [filtersWords, setFiltersWords] = useState({
    use: false,
    categories: [], // WORDS_CATEGORIES, non-empty
    types: [], // WORDS_TYPES, non-empty
  })
  const [settings, setSettings] = useState({
    time: 20, // in seconds, or null|undefined for no timer
    incognito: false, // if true, does not save progress
    furigana: 'auto', // auto for auto-detected from progress, romaji for romaji only, hiragana for hiragana only, null|undefined for no furigana
  })

  const [dataMora, setDataMora] = useState({
    loading: false,
    raw: [],
    map: [],
    modifiers: {
      sokuon: { hiragana: null, katakana: null },
      yoon: {
        hiragana: { ya: null, yu: null, yo: null },
        katakana: { ya: null, yu: null, yo: null },
      },
    },
  })
  const [dataWords, setDataWords] = useState({
    loading: false,
    raw: [],
    map: [],
  })

  const [userProgress, setUserProgress] = useState({})
  const [typerPool, setTyperPool] = useState({})

  // const generateMoraMap = (moraData) => {
  //   const filteredMora = new Map([])

  //   moraData.forEach(({ symbol, ...mora}) => {
  //     const hasSokuon = mora?.sokuon !== undefined && mora.sokuon !== null
  //     const hasYoon = mora?.yoon !== undefined && mora.sokuon !== null
  //     const romaji = mora?.furigana?.romaji || ''
  //     const script = mora?.script || 'hiragana'
  //     const furigana = mora?.furigana

  //     const items = [
  //       {
  //         key: romaji,
  //         symbol: symbol,
  //         furigana: pickFurigana(furigana, )
  //       }
  //     ]
  //   })
  // }

  // const updateMoraData = (data) => {
  //   let rawMoraData = rawData.mora
  //   let modifierData = modifiers

  //   if (data !== null) {
  //     setRawData(prev => {
  //       let newRawData = { ...prev }

  //       if (data !== null) {
  //         const uniqueNewMora = data.filter(newObj => (
  //           !newRawData.mora.some(oldObj => (
  //             oldObj.symbol === newObj.symbol
  //           ))
  //         ))
  //         newRawData.mora.push(...uniqueNewMora)
  //       }

  //       rawMoraData = newRawData
  //       return newRawData
  //     })

  //     setModifiers(prev => {
  //       let mod = { ...prev }

  //       if (mod.sokuon.hiragana === null)
  //         mod.sokuon.hiragana = data
  //           .filter(obj => obj.script === 'hiragana')
  //           .find(obj => obj.furigana.romaji === 'tsu')
  //           ?.small || null
        
  //       if (mod.sokuon.katakana === null)
  //         mod.sokuon.katakana = data
  //           .filter(obj => obj.script === 'katakana')
  //           .find(obj => obj.furigana.romaji === 'tsu')
  //           ?.small || null
        
  //       if (mod.yoon.hiragana.ya === null)
  //         mod.yoon.hiragana.ya = data
  //           .filter(obj => obj.script === 'hiragana')
  //           .find(obj => obj.furigana.romaji === 'ya')
  //           ?.small || null

  //       if (mod.yoon.hiragana.yu === null)
  //         mod.yoon.hiragana.yu = data
  //           .filter(obj => obj.script === 'hiragana')
  //           .find(obj => obj.furigana.romaji === 'yu')
  //           ?.small || null
        
  //       if (mod.yoon.hiragana.yo === null)
  //         mod.yoon.hiragana.yo = data
  //           .filter(obj => obj.script === 'hiragana')
  //           .find(obj => obj.furigana.romaji === 'yo')
  //           ?.small || null

  //       if (mod.yoon.katakana.ya === null)
  //         mod.yoon.katakana.ya = data
  //           .filter(obj => obj.script === 'katakana')
  //           .find(obj => obj.furigana.romaji === 'ya')
  //           ?.small || null

  //       if (mod.yoon.katakana.yu === null)
  //         mod.yoon.katakana.yu = data
  //           .filter(obj => obj.script === 'katakana')
  //           .find(obj => obj.furigana.romaji === 'yu')
  //           ?.small || null
        
  //       if (mod.yoon.katakana.yo === null)
  //         mod.yoon.katakana.yo = data
  //           .filter(obj => obj.script === 'katakana')
  //           .find(obj => obj.furigana.romaji === 'yo')
  //           ?.small || null
        
  //       modifierData = mod
  //       return mod
  //     })
  //   }
  // }

  // const updateWordsData = (data) => {
  //   setRawData(prev => {
  //     let newRawData = { ...prev }

  //     if (data !== null) {
  //       const uniqueNewWords = data.filter(newObj => (
  //         !newRawData.words.some(oldObj => (
  //           oldObj.kana === newObj.kana
  //         ))
  //       ))
  //       newRawData.words.push(...uniqueNewWords)
  //     }

  //     return newRawData
  //   })
  // }

  const getFilteredDataFromDb = async () => {
    const sample = await import('../data/db-sample.json')
    setDataMora(prev => ({ ...prev, loading: true }))
    setDataWords(prev => ({ ...prev, loading: true }))

    let moraData = null
    let wordsData = null

    if (filtersMora.use) {
      const occurences = [] // value=true if script exists in rawData
      const uniqueScripts = [] // name of scripts that do not exist in rawData

      // Checks if specific script is already included in rawData
      for (const script of filtersMora.scripts) {
        const res = rawData.mora.find(obj => obj.script == script) !== undefined
        occurences.push(res)
        if (res === false)
          uniqueScripts.push(script)
      }

      if (occurences.length < 1 || occurences.some(x => x === false)) {
        // TODO: use this code after testing
        // const ref = collection(db, 'mora')
        // const q = query(ref, where('script', 'in', uniqueScripts))
        // const docs = await getDocs(q)
        // const data = docs.map(doc => doc.data())
        const data = sample.mora.filter(obj => uniqueScripts.includes(obj.script))
        moraData = data
        console.debug('filtersMora > rawData.mora:', data)
      }
    }

    if (filtersWords.use) {
      // smae as `if (filtersMora.use)...`
      const occurences = [] // value=true if category exists in rawData
      const uniqueCategories = [] // name of categories that do not exist in rawData

      // Checks if specific category is already included in rawData
      for (const category of filtersWords.categories) {
        const res = rawData.words.find(obj => obj.category == category) !== undefined
        occurences.push(res)
        if (res === false)
          uniqueCategories.push(script)
      }

      if (occurences.length < 1 || occurences.some(x => x === false)) {
        // TODO: use this code after testing
        // const ref = collection(db, 'words')
        // const q = query(ref, where('category', 'in', uniqueCategories))
        // const docs = await getDocs(q)
        // const data = docs.map(doc => doc.data())
        const data = sample.words.filter(obj => uniqueCategories.includes(obj.category))
        wordsData = data
        console.debug('filtersWords > rawData.words:', data)
      }
    }

    if (moraData !== null) {
      const getSmallSymbol = (source, script, target) => source
        .filter(obj => obj.script === script)
        .find(obj => obj.furigana.romaji == target)
        ?.small || null

      setDataMora(prev => {
        let newRawData = prev.raw
        let newModifiersData = prev.modifiers

        const uniqueNewMora = moraData.filter(newObj => (
          !newRawData.some(oldObj => (
            oldObj.symbol === newObj.symbol
          ))
        ))
        newRawData.push(...uniqueNewMora)
      })
    }

    // setRawData(prev => {
    //   let newRawData = { ...prev }
    //   if (data !== null) {
    //     const uniqueNewMora = data.filter(newObj => (
    //       !newRawData.mora.some(oldObj => (
    //         oldObj.symbol === newObj.symbol
    //       ))
    //     ))
    //     newRawData.mora.push(...uniqueNewMora)
    //   }
    //   rawMoraData = newRawData
    //   return newRawData
    // })
  }

  const updateUserProgress = () => {
    // TODO: import from db i guess
    setUserProgress(() => ({
      'オ': 5,
      'エ': 1,
      'ッヴ': 9,
      'ヒョ': 6,
    }))
  }

  const value = {

  }

  return (
    <TyperDataContext.Provider value={value}>
      {children}
    </TyperDataContext.Provider>
  )
}
