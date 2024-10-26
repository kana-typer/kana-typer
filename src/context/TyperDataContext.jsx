import { createContext, useContext, useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore'

import { db, auth } from '../config/firebase'

import { MORA_SCRIPTS, MORA_TYPES, WORDS_CATEGORIES, WORDS_TYPES } from '../utils/kana'

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
      raw: [], // raw data of every hiragana and katakana mora (no kya, chu, etc.)
      map: new Map([]), // only mora and morae for typer pool (might have kya, chu, etc.)
    },
    words: {
      raw: [], // raw data of every word (has all verbs, nouns, etc.)
      map: new Map([]), // only words for typer pool (might have verbs, nouns, etc.)
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
    progress: {}
  })

  // i: holds words and mora maps in one place, typerData state is used as readonly-from-outside reference
  const [typerPool, setTyperPool] = useState(null)

  const loadProgressDataFromDb = async () => {
    // TODO: use this code after testing
    // const ref = doc(db, 'users', auth.currentUser.uid)
    // const q = query(ref, select('progress'))
    // const doc = await getDoc(q)
    // const data = doc.data().progress
    const data = { 'あ': 5 }
    return data
  }

  const loadFromDbByFilter = async (filters, group, source, collectionName, propertyName) => {
    const sample = await import('../data/db-sample.json')

    let data = null

    if (filters.use) {
      const occurences = [] // value=true if group exists in source
      const uniqueGroups = [] // names of groups that do not exist in source

      // Checks occurence of specific groups in source to know what is already present
      for (const groupName of filters?.[group] || []) {
        const res = source.find(obj => obj?.[propertyName] === groupName) !== undefined
        occurences.push(res)
        if (res === false)
          uniqueGroups.push(groupName)
      }

      // If specific groups already occur in source, connection to db will be skipped
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

  const generateModifiers = (source, prevModifiers) => {
    const getSmallSymbol = (source, script, target) => source
      .filter(obj => obj.script === script)
      .find(obj => obj.furigana.romaji == target)
      ?.small || null

    const data = { ...prevModifiers }

    if (data.sokuon.hiragana === null)
      data.sokuon.hiragana = getSmallSymbol(source, 'hiragana', 'tsu')

    if (data.sokuon.katakana === null)
      data.sokuon.katakana = getSmallSymbol(source, 'katakana', 'tsu')

    if (data.yoon.hiragana.ya === null)
      data.yoon.hiragana.ya = getSmallSymbol(source, 'hiragana', 'ya')

    if (data.yoon.hiragana.yu === null)
      data.yoon.hiragana.yu = getSmallSymbol(source, 'hiragana', 'yu')

    if (data.yoon.hiragana.yo === null)
      data.yoon.hiragana.yo = getSmallSymbol(source, 'hiragana', 'yo')

    if (data.yoon.katakana.ya === null)
      data.yoon.katakana.ya = getSmallSymbol(source, 'katakana', 'ya')

    if (data.yoon.katakana.yu === null)
      data.yoon.katakana.yu = getSmallSymbol(source, 'katakana', 'yu')

    if (data.yoon.katakana.yo === null)
      data.yoon.katakana.yo = getSmallSymbol(source, 'katakana', 'yo')

    return data
  }

  const pickFurigana = (furigana, progress) => {
    const hasHiragana = furigana?.hiragana !== undefined
    const quantityOffset = hasHiragana ? 0 : 5

    if (progress === undefined || 
        progress === null || 
        progress < 5 + quantityOffset)
      return furigana?.romaji || ''

    else if (progress < 10 + quantityOffset)
      return furigana?.hiragana || ''

    return ''
  }

  const generateMoraMap = (source, modifiers, progress, filters) => {
    const yoons = ['ya', 'yu', 'yo']
    const map = new Map([])

    source.forEach(({ symbol, ...mora }) => {
      const hasSokuon = mora?.sokuon !== undefined && mora.sokuon !== null
      const hasYoon = mora?.yoon !== undefined && mora.sokuon !== null
      const romaji = mora?.furigana?.romaji || ''
      const script = mora?.script || 'hiragana'
      const furigana = mora?.furigana
      const items = []

      // needs to remember yoon configuration if both sokuon and yoon are present
      let yoonRomaji = ''
      let yoonSymbol = ''
      let yoonFurigana = {}

      let skip = false
      if (!filters.scripts.includes(mora?.script || '') || 
          !filters.types.includes(mora?.type || '') ||
          filters.extended === false && mora?.extended === true)
        skip = true

      if (!skip) {
        items.push({
          key: romaji,
          kana: symbol,
          furigana: pickFurigana(furigana, progress?.[symbol]),
          translation: null,
          reading: null,
        })
      }

      if (hasSokuon && filters.sokuon === true) {
        const sokuonRomaji = mora.sokuon + romaji
        const sokuonSymbol = modifiers.sokuon[script] + symbol
        const sokuonFurigana = {}

        if (furigana?.romaji !== undefined)
          sokuonFurigana.romaji = sokuonRomaji

        if (furigana?.hiragana !== undefined)
          sokuonFurigana.hiragana = modifiers.sokuon.hiragana + furigana.hiragana

        items.push({
          key: sokuonRomaji,
          kana: sokuonSymbol,
          furigana: pickFurigana(sokuonFurigana, progress?.[symbol]), // i: kka is treated as ka; tte as te; etc.
          translation: null,
          reading: null,
        })
      }

      if (hasYoon && filters.yoon === true) {
        const base = romaji.slice(0, -1)

        yoons.forEach(yoon => {
          yoonRomaji = base + (mora.yoon === 'y' ? yoon : yoon.charAt(1))
          yoonSymbol = symbol + modifiers.yoon[script][yoon]
          yoonFurigana = {}

          if (furigana?.romaji !== undefined)
            yoonFurigana.romaji = yoonRomaji

          if (furigana?.hiragana !== undefined)
            yoonFurigana.hiragana = furigana.hiragana + modifiers.yoon.hiragana[yoon]

          items.push({
            key: yoonRomaji,
            kana: yoonSymbol,
            furigana: pickFurigana(yoonFurigana, progress?.[symbol]), // i: kya, kyu, kyo are treated as ki; cha, chu, cho as chi; etc.
            translation: null,
            reading: null,
          })
        })
      }

      if (hasSokuon && hasYoon && filters.sokuon === true && filters.yoon === true) {
        const bothRomaji = mora.sokuon + yoonRomaji
        const bothSymbol = modifiers.sokuon[script] + yoonSymbol
        const bothFurigana = {}

        if (furigana?.romaji !== undefined)
          bothFurigana.romaji = bothRomaji

        if (furigana?.hiragana !== undefined)
          bothFurigana.hiragana = modifiers.sokuon.hiragana + yoonFurigana.hiragana

        items.push({
          key: bothRomaji,
          kana: bothSymbol,
          furigana: pickFurigana(bothFurigana, progress?.[symbol]), // i: kkya, kkyu, kkte are treated as ki; tcha, tchu, tche as chi; etc.
          translation: null,
          reading: null,
        })
      }

      items.forEach(({ key, ...data }) => { // TODO: not too optimal :/
        if (map.has(key))
          map.set(key, [...map.get(key), data])
        else
          map.set(key, [data])
      } )
    })

    return map
  }

  const generateWordsMap = (source, progress, filters) => {
    const map = new Map([])

    source.forEach(({ kana, ...word }) => {
      const romaji = word?.furigana?.romaji || ''
      const furigana = word?.furigana
      const items = []

      let skip = false
      if (!filters.categories.includes(word?.category || '') || 
          !filters.types.includes(word?.type || ''))
        skip = true

      if (!skip) {
        items.push({
          key: romaji,
          kana: kana,
          furigana: pickFurigana(furigana, progress?.[kana]),
          translation: word?.translation?.en || '',
          reading: word?.furigana?.reading || null,
        })
      }

      items.forEach(({ key, ...data }) => {
        if (map.has(key))
          map.set(key, [...map.get(key), data])
        else
          map.set(key, [data])
      })
    })

    return map
  }

  const updateTyperData = async () => {
    const data = { ...typerData }

    // Get user progress first as it is needed to generate proper furigana for maps
    data.progress = await loadProgressDataFromDb()

    // Get mora only if specified by filters
    const newRawMora = await loadFromDbByFilter(
      typerFilters.mora, 
      'scripts', 
      data.mora.raw, 
      'mora', 
      'script'
    )
    if (newRawMora !== null) {
      // Append only new objects
      data.mora.raw.push(...getUniqueRawData(newRawMora, data.mora.raw, 'symbol'))

      // Update modifiers if there is a need to
      const modifierValues = [
        ...Object.values(data.modifiers.sokuon),
        ...Object.values(data.modifiers.yoon.hiragana),
        ...Object.values(data.modifiers.yoon.katakana),
      ]
      const modifiersMissing = modifierValues.some(x => [null, undefined].includes(x))
      if (modifiersMissing)
        data.modifiers = generateModifiers(data.mora.raw, data.modifiers)

      // Create new mora map
      data.mora.map = generateMoraMap(data.mora.raw, data.modifiers, data.progress, typerFilters.mora)
    }

    // Get words only if specified by filters
    const newRawWords = await loadFromDbByFilter(
      typerFilters.words, 
      'categories', 
      data.words.raw, 
      'words', 
      'category'
    )
    if (newRawWords !== null) {
      // Append only new objects
      data.words.raw.push(...getUniqueRawData(newRawWords, data.words.raw, 'kana'))

      data.words.map = generateWordsMap(data.words.raw, data.progress, typerFilters.words)
    }

    setTyperData(prev => data)

    setTyperPool(() => new Map([...data.mora.map, ...data.words.map]))
  }

  const setFilters = (mode) => {
    const scriptValues = Object.values(MORA_SCRIPTS)
    const categoryValues = Object.values(WORDS_CATEGORIES)

    const moraScripts = mode === 'allKana' || mode === 'all'
      ? scriptValues
      : scriptValues.includes(mode)
        ? [MORA_SCRIPTS?.[mode]]
        : []

    const wordsCategories = mode === 'allWords' || mode === 'all'
      ? categoryValues
      : categoryValues.includes(mode)
        ? [WORDS_CATEGORIES?.[mode]]
        : []

    setTyperFilters(prev => {
      const newMora = {
        ...prev.mora,
        use: moraScripts.length !== 0,
        scripts: moraScripts,
        types: (prev.mora?.types?.length ?? 0) < 2 
          ? [MORA_TYPES.gojuon] 
          : prev.mora.types,
        extended: ['allKana', 'all'].includes(mode),
      }
      const newWords = {
        ...prev.words,
        use: wordsCategories.length !== 0,
        types: (prev.words?.types?.length ?? 0) < 2
          ? [WORDS_TYPES.nouns]
          : prev.words.types,
        categories: wordsCategories,
      }
      return { ...prev, mora: newMora, words: newWords }
    })
  }

  /**
   * Sets specific prop in specified set (mora | words | typer) with given value.
   * If `checked` param is not undefined, prop is treated as an array that cannot be empty.
   */
  const setFiltersProp = (set, prop, value, checked) => {
    if (!Object.keys(typerFilters).includes(set)) {
      console.error('wrong argument `set` in setFiltersProp')
      return
    }

    setTyperFilters(prev => {
      let newValue = value

      if (checked !== undefined) {
        newValue = []
        const oldValue = prev[set]?.[prop] ?? []
        const isIncluded = oldValue.includes(value)
        const isLastItem = oldValue.length < 2

        if (checked && !isIncluded)
          newValue = [...oldValue, value]
        else if (!checked && isIncluded)
          newValue = isLastItem
            ? oldValue
            : oldValue.filter(item => item !== value)
      }

      return {
        ...prev,
        [set]: {
          ...prev[set],
          [prop]: newValue
        }
      }
    })
  }

  const value = {
    filterNames: {
      ...MORA_SCRIPTS,
      ...WORDS_CATEGORIES,
      allKana: 'allKana',
      allWords: 'allWords',
      all: 'all'
    },
    typerFilters: typerFilters,
    setTyperFilters: setFilters,
    setTyperFiltersProp: setFiltersProp,
    typerMap: typerPool,
    updateTyperMap: updateTyperData // TODO: check if this can be rewritten to use prevValue from SetState as the object to be based off of rather than typerData directly
  }

  return (
    <TyperDataContext.Provider value={value}>
      {children}
    </TyperDataContext.Provider>
  )
}
