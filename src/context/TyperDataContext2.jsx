import { createContext, useContext, useState } from 'react'
import { collection, getDocs, query } from 'firebase/firestore'

import { db } from '../config/firebase'

import { MORA_SCRIPTS, MORA_TYPES, WORDS_CATEGORIES, WORDS_TYPES } from '../utils/kana'
import { objectsEqual } from '../utils/types'

const TyperDataContext = createContext()

export const useTyperData = () => useContext(TyperDataContext)

export default function TyperDataProvider({ children }) {
  const [typerFilters, setTyperFilters] = useState({
    mora: {
      use: false,
      scripts: [], // MORA_SCRIPTS, non-empty
      types: [], // MORA_TYPES, non-empty
      extended: true, // only for katakana, e.g. che, ti, tsa
      sokuon: true, // e.g. kka, dde, hhya
      yoon: true, // e.g. kya, ju, hhyo
    },
    words: {
      use: false,
      categories: [], // WORDS_CATEGORIES, non-empty
      types: [], // WORDS_TYPES, non-empty
    },
    typer: {
      time: 20, // in seconds, or null|undefined for no timer
      incognito: false, // if true, does not save progress
      furigana: 'auto', // auto for auto-detected from progress, romaji for romaji only, hiragana for hiragana only, null|undefined for no furigana
    },
  })

  const [typerData, setTyperData] = useState({
    mora: {
      raw: [],
      map: null,

    },
    words: {
      raw: [],
      map: null,
    },
    modifiers: {
      sokuon: { 
        hiragana: null, 
        katakana: null,
      },
      yoon: {
        hiragana: { ya: null, yu: null, yo: null },
        katakana: { ya: null, yu: null, yo: null },
      },
    },
    user: {}
  })

  const [typerPool, setTyperPool] = useState({})

  const loadFromDbByFilter = async (filters, group, source, collectionName, propertyName) => {
    const sample = await import('../data/db-sample.json')

    let data = null

    if (filters.use) {
      const occurences = [] // value=true if group exists in source
      const uniqueGroups = [] // names of groups that do not exist in source

      for (const groupName of filters?.[group] || []) {
        const res = source.find(obj => obj?.[propertyName] === groupName) !== undefined
        occurences.push(res)
        if (res === false)
          uniqueGroups.push(groupName)
      }

      if (occurences.length < 1 || occurences.some(x => x === false)) {
        // TODO: use this code after testing
        // const ref = collection(db, collectionName)
        // const q = query(ref, where(group, 'in', uniqueGroups))
        // const docs = await getDocs(q)
        // data = docs.map(doc => doc.data())
        data = sample?.[collectionName]?.filter(obj => uniqueGroups.includes(obj?.[propertyName])) || null
      }
    }

    return data
  }

  const getUniqueRawData = (newData, oldData, key) => (
    newData.filter(newObj => !oldData.some(oldObj => oldObj?.[key] === newObj?.[key]))
  )

  const updateModifiers = (source, prevModifiers) => {
    const getSmallSymbol = (source, script, target) => source
      .filter(obj => obj.script === script)
      .find(obj => obj.furigana.romaji == target)
      ?.small || null

    const data = { ...prevModifiers }

    if (data.sokuon.hiragana !== null)
      data.sokuon.hiragana = getSmallSymbol(source, 'hiragana', 'tsu')

    if (data.sokuon.katakana !== null)
      data.sokuon.katakana = getSmallSymbol(source, 'katakana', 'tsu')

    if (data.yoon.hiragana.ya !== null)
      data.yoon.hiragana.ya = getSmallSymbol(source, 'hiragana', 'ya')

    if (data.yoon.hiragana.yu !== null)
      data.yoon.hiragana.yu = getSmallSymbol(source, 'hiragana', 'yu')

    if (data.yoon.hiragana.yo !== null)
      data.yoon.hiragana.yo = getSmallSymbol(source, 'hiragana', 'yo')

    if (data.yoon.hiragana.ya !== null)
      data.yoon.katakana.ya = getSmallSymbol(source, 'katakana', 'ya')

    if (data.yoon.hiragana.yu !== null)
      data.yoon.katakana.yu = getSmallSymbol(source, 'katakana', 'yu')

    if (data.yoon.hiragana.yo !== null)
      data.yoon.katakana.yo = getSmallSymbol(source, 'katakana', 'yo')

    return data
  }

  const updateTyperData = async (prevData) => {
    const data = { ...prevData }

    // Get mora (if specified by filters) and append any new objects
    const newRawMora = await loadFromDbByFilter(
      typerFilters.mora, 
      'scripts', 
      data.mora.raw, 
      'mora', 
      'script'
    )
    if (newRawMora !== null)
      data.mora.raw.push(...getUniqueRawData(newRawMora, data.mora.raw, 'symbol'))

    // Get words (if specified by filters) and append any new objects
    const newRawWords = await loadFromDbByFilter(
      typerFilters.words, 
      'categories', 
      data.words.raw, 
      'words', 
      'category'
    )
    if (newRawWords !== null)
      data.words.raw.push(...getUniqueRawData(newRawWords, data.words.raw, 'kana'))

    // Update modifiers if there is a need to
    const modifierValues = [
      ...Object.values(data.modifiers.sokuon),
      ...Object.values(data.modifiers.yoon.hiragana),
      ...Object.values(data.modifiers.yoon.katakana),
    ]
    const modifiersMissing = modifierValues.some(x => x === undefined)
    if (modifiersMissing)
      data.modifiers = updateModifiers(data.mora.raw, data.modifiers)
    

  }

  const value = {

  }

  return (
    <TyperDataContext.Provider value={value}>
      {children}
    </TyperDataContext.Provider>
  )
}
