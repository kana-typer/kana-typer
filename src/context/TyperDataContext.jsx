import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { FURIGANA_DECREMENT_MULTIPLIER, FURIGANA_INCREMENT_MULTIPLIER, generateModifiers, generateMoraMap, generateWordsMap, MORA_SCRIPTS, MORA_TYPES, WORDS_CATEGORIES, WORDS_TYPES } from '../utils/kana'
import { getDocuments, getUserField, updateUserMapField } from '../utils/db'
import { getMapOfOccurences, getUniqueData } from '../utils/objects'
import { isNullOrUndefined } from '../utils/types'

const TyperDataContext = createContext()

export const useTyperData = () => useContext(TyperDataContext)

export default function TyperDataProvider({ children }) {
  const { pathname } = useLocation()

  const [typerFilters, setTyperFilters] = useState({ // stores user-defined filters for typer game
    mora: {
      use: false, // if set of symbols should be generated
      scripts: [], // MORA_SCRIPTS, non-empty
      types: [], // MORA_TYPES, non-empty
      extended: true, // only for katakana, e.g. che, ti, tsa
      sokuon: true, // e.g. kka, dde, hhya
      yoon: true, // e.g. kya, ju, hhyo
    },
    words: {
      use: false, // if set of symbols should be generated
      categories: [], // WORDS_CATEGORIES, non-empty
      types: [], // WORDS_TYPES, non-empty
    },
    typer: {
      time: 60, // in seconds, or null|undefined for no timer
      incognito: false, // if true, does not save progress
      furigana: 'auto', // auto for auto-detected from progress, romaji for romaji only, hiragana for hiragana only, null|undefined for no furigana
    },
  })

  const [typerData, setTyperData] = useState({ // stores raw data from database, generated maps of symbols for typer game, mora modifiers (e.g. xya) and user's current progress
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

  const [typerPool, setTyperPool] = useState(null) // holds words and mora maps in one place, typerData state is used as readonly-from-outside reference

  /**
   * Loads user typer progress from database.
   * @returns object with user-known symbols as keys and their respective progress as values.
   */
  const loadProgressDataFromDb = async () => {
    console.debug(`loading user progress data from db`)
    return await getUserField('progress') || {}
  }

  /**
   * Loads a specified collection from database only if data, relating to filter with which it is queried from db, is not already stored in source.
   * @param {{ use: boolean, scripts?: string[], categories?: string[] }} filters - typerFilter subobject, either typerFilter.mora or typerFilter.words
   * @param {'scripts' | 'categories'} group - specific group key's name (not value) that needs to be checked against from filters object, where filters object needs to have it as key
   * @param {Array<{ script?: string, category?: string }>} source - readonly reference to an object that will store result of this function to check for duplicates
   * @param {'mora' | 'words'} collectionName - name of the collection in database
   * @param {'script' | 'category'} propertyName - specific group key's name (not value) that items in db's collection need to have to be queried
   * @returns array of objects from databse, or null if no additional data was needed to be queried
   */
  const loadFromDbByFilter = async (filters, group, source, collectionName, propertyName) => {
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
        console.warn(group, uniqueGroups)
        data = (await getDocuments(collectionName, [[propertyName, 'in', uniqueGroups]])) ?? null
      } else {
        console.debug(`loading ${collectionName} aborted - raw data of ${group} already exists in context`)
      }
    } else {
      console.debug(`loading ${collectionName} aborted - filters.use=${filters.use}`)
    }

    return data
  }

  /**
   * Updates the whole typerData object based off of typerFilters.
   * It fetched data from database, fills specific objects with data, generated map objects for mora and words and fills typerPool with only required objects.
   * Updates typerData and typerPool.
   */
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
      const uniqueMora = getUniqueData(newRawMora, data.mora.raw, 'symbol')
      data.mora.raw.push(...uniqueMora)

      // Update modifiers if there is a need to
      const modifierValues = [
        ...Object.values(data.modifiers.sokuon),
        ...Object.values(data.modifiers.yoon.hiragana),
        ...Object.values(data.modifiers.yoon.katakana),
      ]
      const modifiersMissing = modifierValues.some(isNullOrUndefined)

      if (modifiersMissing) {
        data.modifiers = generateModifiers(data.mora.raw, data.modifiers)
      }
    }

    // Create new mora map
    data.mora.map = generateMoraMap(data.mora.raw, data.modifiers, data.progress, typerFilters.mora)

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
      const uniqueWords = getUniqueData(newRawWords, data.words.raw, 'kana')
      data.words.raw.push(...uniqueWords)
    }

    // Create new words map
    data.words.map = generateWordsMap(data.words.raw, data.progress, typerFilters.words)

    setTyperData(() => {
      return data
    })

    setTyperPool(() => {
      return new Map([...data.mora.map, ...data.words.map])
    })
  }

  const updateUserProgress = async (correctHits, incorrectHits) => {
    const correct = getMapOfOccurences(Object.values(correctHits))
    const incorrect = getMapOfOccurences(Object.values(incorrectHits))
    const newProgress = { ...typerData.progress }
    
    for (const [kana, times] of correct)
      newProgress[kana] = (newProgress[kana] || 0) + times * FURIGANA_INCREMENT_MULTIPLIER
    
    for (const [kana, times] of incorrect)
      newProgress[kana] = Math.abs((newProgress[kana] || 0) - times * FURIGANA_DECREMENT_MULTIPLIER)

    await updateUserMapField('progress', newProgress)
  }

  /**
   * Helper function to set a specific hard-coded set of filters for specific categories.
   * It is done to make the UX simpler and faster for the user, rather than having to select everything one by one.
   * Updates typerFilters with new mora and word filters if any changes were found.
   * @param {string} mode - name of a selected set of filters, it consists of specific mora scripts, specific word categories, allKana, allWords and all (all kana and all words)
   */
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
      // // console.debug(`staging state change for typer filters with new mode ${mode}`)
      return { ...prev, mora: newMora, words: newWords }
    })
  }

  /**
   * Sets specific prop in specified set (mora | words | typer) with given value.
   * If param checked is not undefined, prop is treated as an array that cannot be empty.
   * Updates typerFilters
   * @param {'mora' | 'words' | 'typer'} set - specific grouping/set of typerFilters
   * @param {string} prop - name of property in specified set to update its value to something else
   * @param {any} value - new value of specified property
   * @param {boolean} checked - flag for toggle-able elements (input:checkbox) so that there is always at least one element checked for the checkbox grouping
   */
  const setFiltersProp = (set, prop, value, checked) => {
    if (!Object.keys(typerFilters).includes(set)) {
      console.error(`Wrong argument 'set' in setFiltersProp.`)
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
    filterNames: { // sets of filters to display for user to choose from in a side navigation
      ...MORA_SCRIPTS,
      ...WORDS_CATEGORIES,
      allKana: 'allKana',
      allWords: 'allWords',
      all: 'all'
    },
    typerFilters: typerFilters, // object with typer filters
    setTyperFilters: setFilters, // function to set typer filters to a specific pre-defined set
    setTyperFiltersProp: setFiltersProp, // function to set a property of filter object
    typerMap: typerPool, // Map object of all the symbols (kana or words) to pick from for typer game
    updateTyperMap: updateTyperData, // TODO: check if this can be rewritten to use prevValue from SetState as the object to be based off of rather than typerData directly
    updateUserProgress: updateUserProgress,
    resetTyperMap: () => setTyperPool(null) // hard fix to reset typer pool to null when the game is done, so that a new game can start loading after checking that pool is null
  }

  useEffect(() => { // fix to set typer pool to null when we enter/refresh the /typer page and the pool is not null, since by then the user clearly wants to play anew
    if (pathname.includes('/typer') && typerPool !== null)
      setTyperPool(null)
  }, [pathname])

  return (
    <TyperDataContext.Provider value={value}>
      {children}
    </TyperDataContext.Provider>
  )
}
