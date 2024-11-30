import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { MORA_SCRIPTS, MORA_TYPES, WORDS_CATEGORIES, WORDS_TYPES } from '../utils/kana'
import { getDocuments, getUserField, updateUserMapField } from '../utils/db'

const TyperDataContext = createContext()

export const useTyperData = () => useContext(TyperDataContext)

export default function TyperDataProvider({ children }) {
  const { pathname } = useLocation()

  const [typerFilters, setTyperFilters] = useState({ // stotes user-defined filters for typer game
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
      time: 20, // in seconds, or null|undefined for no timer
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
    // // const sampleData = { 'あ': 5 }
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
    // console.debug(`loading ${collectionName} from db`)
    // // const sample = await import('../data/db-sample.json')

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
        // // data = sample?.[collectionName]?.filter(obj => uniqueGroups.includes(obj?.[propertyName])) || null
        console.warn(group, uniqueGroups)
        data = await getDocuments(collectionName, [[propertyName, 'in', uniqueGroups]])
      } else {
        console.debug(`loading ${collectionName} aborted - raw data of ${group} already exists in context`)
      }
    } else {
      console.debug(`loading ${collectionName} aborted - filters.use=${filters.use}`)
    }

    return data
  }

  /**
   * Filters old data based off of identifiably unique values of given key, to check for duplicates and return only new objects based off of that identifiable unique value of specified key.
   * Will take a long time depending on the size of the data. In worse case scenario O(n^2).
   * @param {object[]} newData - new data with possible duplicates
   * @param {object[]} oldData - old data to check against for duplicates
   * @param {string} key - object's property in both data sets to check against its value
   * @returns {object[]} filtered new data array that contains either only unique objects or is an empty array.
   */
  const getUniqueRawData = (newData, oldData, key) => (
    newData.filter(newObj => !oldData.some(oldObj => oldObj?.[key] === newObj?.[key]))
  )

  /**
   * Generates still missing mora modifiers based off of given source object.
   * @param {object[]} source - array of objects that might store object that are required to create other, modified mora symbols (e.g. ya)
   * @param {{ sokuon: { hiragana: string | null, katakana: string | null }, yoon: { hiragana: { ya: string | null, yu: string | null, yo: string | null }, katakana: { ya: string | null, yu: string | null, yo: string | null } } }} prevModifiers - object of mora modifiers
   * @returns {{ sokuon: { hiragana: string | null, katakana: string | null }, yoon: { hiragana: { ya: string | null, yu: string | null, yo: string | null }, katakana: { ya: string | null, yu: string | null, yo: string | null } } }} object with mora modifiers set to a string value if any missing (null) modifiers were found and their respective data source found in source object.
   */
  const generateModifiers = (source, prevModifiers) => {
    // console.debug(`loading modifiers from source`)
    const getSmallSymbol = (source, script, target) => source
      .filter(obj => obj.script === script)
      .find(obj => obj.furigana.romaji == target)
      ?.small || null

    const data = { ...prevModifiers }

    if (data.sokuon.hiragana === null) {
      data.sokuon.hiragana = getSmallSymbol(source, 'hiragana', 'tsu')
      // console.debug(`added hiragana tsu modifier`)
    }

    if (data.sokuon.katakana === null) {
      data.sokuon.katakana = getSmallSymbol(source, 'katakana', 'tsu')
      // console.debug(`added katakana tsu modifier`)
    }

    if (data.yoon.hiragana.ya === null) {
      data.yoon.hiragana.ya = getSmallSymbol(source, 'hiragana', 'ya')
      // console.debug(`added hiragana ya modifier`)
    }

    if (data.yoon.hiragana.yu === null) {
      data.yoon.hiragana.yu = getSmallSymbol(source, 'hiragana', 'yu')
      // console.debug(`added hiragana yu modifier`)
    }

    if (data.yoon.hiragana.yo === null) {
      data.yoon.hiragana.yo = getSmallSymbol(source, 'hiragana', 'yo')
      // console.debug(`added hiragana yo modifier`)
    }

    if (data.yoon.katakana.ya === null) {
      data.yoon.katakana.ya = getSmallSymbol(source, 'katakana', 'ya')
      // console.debug(`added katakana ya modifier`)
    }

    if (data.yoon.katakana.yu === null) {
      data.yoon.katakana.yu = getSmallSymbol(source, 'katakana', 'yu')
      // console.debug(`added katakana yu modifier`)
    }

    if (data.yoon.katakana.yo === null) {
      data.yoon.katakana.yo = getSmallSymbol(source, 'katakana', 'yo')
      // console.debug(`added katakana yo modifier`)
    }

    return data
  }

  /**
   * Based off of hard-coded ranges, returns either romaji furigana, hiragana furigana or no furigana based off of user progress data.
   * @param {{ hiragana: string | null, reading: string | null }} furigana - object with additional reading information
   * @param {{ [key: string]: number }} progress - user's progress object on symbol whose currently passed furigana is part of
   * @returns {string} proper furigana in text format or an empty string in case of an unexpected behavior.
   */
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

  /**
   * Generates a map of parsed mora objects based off of given filters, modifiers and user's progress.
   * It consists of every possible mora combination supported by the spoken language, given filters and modifiers.
   * This map will be used to generate a pool of randomly chosen symbols.
   * @param {object[]} source - source object that has all unmodified symbols straight from the database
   * @param {object} modifiers - object with mora modifiers
   * @param {{ [key: string]: number }} progress - user's progress object for every symbol // TODO: inefficient, filter user's progress beforehand?
   * @param {object[]} filters - user-selected filters to generate only those symbols that were specified by the user - if accepted symbols are not included in source object and therefore cannot be generated, there is likely a bug somewhere else before this function call
   * @returns {Map<string, Array<{ key: string, kana: string, furigana: string, translation: string | null, reading: string | null }>>} a map of all possible combinations with only the data necessary to generate a randomly chosen typer pool and proper UX
   */
  const generateMoraMap = (source, modifiers, progress, filters) => {
    const yoons = ['ya', 'yu', 'yo']
    const map = new Map([])

    source.forEach(({ symbol, ...mora }) => {
      // console.debug(`generating mora map data for ${symbol}`)

      const hasSokuon = mora?.sokuon !== undefined && mora.sokuon !== null
      const hasYoon = mora?.yoon !== undefined && mora.yoon !== null
      const romaji = mora?.furigana?.romaji || ''
      const script = mora?.script || 'hiragana'
      const furigana = mora?.furigana
      const items = []

      let skip = false
      if (!filters.scripts.includes(mora?.script || '') || 
          !filters.types.includes(mora?.type || '') ||
          filters.extended === false && mora?.extended === true)
        skip = true

      if (!skip) {
        // console.debug(`staging ${romaji} mora map data item`)
        items.push({
          key: romaji,
          kana: symbol,
          furigana: pickFurigana(furigana, progress?.[symbol]),
          translation: null,
          reading: null,
        })

        if (hasSokuon && filters.sokuon === true) {
          const sokuonRomaji = mora.sokuon + romaji
          const sokuonSymbol = modifiers.sokuon[script] + symbol
          const sokuonFurigana = {}
  
          if (furigana?.romaji !== undefined)
            sokuonFurigana.romaji = sokuonRomaji
  
          if (furigana?.hiragana !== undefined)
            sokuonFurigana.hiragana = modifiers.sokuon.hiragana + furigana.hiragana
  
          // console.debug(`staging ${sokuonRomaji} mora map data item`)
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
            const yoonRomaji = base + (mora.yoon === 'y' ? yoon : yoon.charAt(1))
            const yoonSymbol = symbol + modifiers.yoon[script][yoon]
            const yoonFurigana = {}
  
            if (furigana?.romaji !== undefined)
              yoonFurigana.romaji = yoonRomaji
  
            if (furigana?.hiragana !== undefined)
              yoonFurigana.hiragana = furigana.hiragana + modifiers.yoon.hiragana[yoon]
  
            // console.debug(`staging ${yoonRomaji} mora map data item`)
            items.push({
              key: yoonRomaji,
              kana: yoonSymbol,
              furigana: pickFurigana(yoonFurigana, progress?.[symbol]), // i: kya, kyu, kyo are treated as ki; cha, chu, cho as chi; etc.
              translation: null,
              reading: null,
            })
  
            if (hasSokuon && filters.sokuon === true) {
              const bothRomaji = mora.sokuon + yoonRomaji
              const bothSymbol = modifiers.sokuon[script] + yoonSymbol
              const bothFurigana = {}
  
              if (furigana?.romaji !== undefined)
                bothFurigana.romaji = bothRomaji
      
              if (furigana?.hiragana !== undefined)
                bothFurigana.hiragana = modifiers.sokuon.hiragana + yoonFurigana.hiragana
  
              // console.debug(`staging ${bothRomaji} mora map data item`)
              items.push({
                key: bothRomaji,
                kana: bothSymbol,
                furigana: pickFurigana(bothFurigana, progress?.[symbol]), // i: kkya, kkyu, kkte are treated as ki; tcha, tchu, tche as chi; etc.
                translation: null,
                reading: null,
              })
            }
          })
        }
      }

      items.forEach(({ key, ...data }) => { // TODO: not too optimal :/
        if (map.has(key)) {
          map.set(key, [...map.get(key), data])
          // console.debug(`appending more data to ${key} mora map item (${data.kana})`)
        } else {
          map.set(key, [data])
          // console.debug(`adding ${key} mora map data item (${data.kana})`)
        }
      })
    })

    return map
  }

  /**
  * Generates a map of parsed words objects based off of given filters and user's progress.
   * It consists of every word that consists in the database after being filtered by user's picks and user's progress.
   * This map will be used to generate a pool of randomly chosen symbols.
   * @param {object[]} source - source object that has all unmodified words straight from the database
   * @param {{ [key: string]: number }} progress - user's progress object for every word // TODO: inefficient, filter user's progress beforehand?
   * @param {object[]} filters - user-selected filters to generate only those words that were specified by the user - if accepted words are not included in source object and therefore cannot be generated, there is likely a bug somewhere else before this function call
   * @returns {Map<string, Array<{ key: string, kana: string, furigana: string, translation: string | null, reading: string | null }>>} a map of all possible combinations with only the data necessary to generate a randomly chosen typer pool and proper UX
   */
  const generateWordsMap = (source, progress, filters) => {
    const map = new Map([])

    source.forEach(({ kana, ...word }) => {
      // console.debug(`generating words map data for ${kana}`)

      const romaji = word?.furigana?.romaji || ''
      const furigana = word?.furigana
      const items = []

      let skip = false
      if (!filters.categories.includes(word?.category || '') || 
          !filters.types.includes(word?.type || ''))
        skip = true

      if (!skip) {
        // console.debug(`staging ${romaji} words map data item`)
        items.push({
          key: romaji,
          kana: kana,
          furigana: pickFurigana(furigana, progress?.[kana]),
          translation: word?.translation?.en || '',
          reading: word?.furigana?.reading || null,
        })
      }

      items.forEach(({ key, ...data }) => {
        if (map.has(key)) {
          map.set(key, [...map.get(key), data])
          // console.debug(`appending more data to ${key} words map item (${data.kana})`)
        } else {
          map.set(key, [data])
          // console.debug(`adding ${key} words map data item (${data.kana})`)
        }
      })
    })

    return map
  }

  /**
   * Updates the whole typerData object based off of typerFilters.
   * It fetched data from database, fills specific objects with data, generated map objects for mora and words and fills typerPool with only required objects.
   * Updates typerData and typerPool.
   */
  const updateTyperData = async () => {
    // console.debug('updating typer context data')

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
      const uniqueMora = getUniqueRawData(newRawMora, data.mora.raw, 'symbol')
      data.mora.raw.push(...uniqueMora)
      // console.debug(`added ${uniqueMora?.length || 0} new raw mora items`)

      // Update modifiers if there is a need to
      const modifierValues = [
        ...Object.values(data.modifiers.sokuon),
        ...Object.values(data.modifiers.yoon.hiragana),
        ...Object.values(data.modifiers.yoon.katakana),
      ]
      const modifiersMissing = modifierValues.some(x => [null, undefined].includes(x))

      if (modifiersMissing) {
        data.modifiers = generateModifiers(data.mora.raw, data.modifiers)
        // console.debug(`added missing mora modifiers`)
      } else {
        // console.debug(`no new mora modifiers added`)
      }
    }

    // Create new mora map
    // TODO: needs to be done so that we generate only what we need from filters - once generated, we cannot filter it, which is bad - needs to change
    data.mora.map = generateMoraMap(data.mora.raw, data.modifiers, data.progress, typerFilters.mora)
    // console.debug(`generated new mora map of size ${data.mora.map.size}`)

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
      const uniqueWords = getUniqueRawData(newRawWords, data.words.raw, 'kana')
      data.words.raw.push(...uniqueWords)
      // console.debug(`added ${uniqueWords?.length || 0} new raw mora items`)
    }

    // Create new words map
    // TODO: same as with creating new more map
    data.words.map = generateWordsMap(data.words.raw, data.progress, typerFilters.words)
      // console.debug(`generated new words map of size ${data.words.map.size}`)

    setTyperData(() => {
      // console.debug(`staging state change for typer data`, data)
      return data
    })

    setTyperPool(() => {
      // console.debug(`staging state change for typer pool using generated data maps`)
      return new Map([...data.mora.map, ...data.words.map])
    })
  }

  const updateUserProgress = async (correctHits, incorrectHits) => {
    const addToMapOfOccurences = (map, x) => {
      map.set(x, (map.get(x) || 0 ) + 1)
      return map
    }

    const correct = Object.values(correctHits).reduce(addToMapOfOccurences, new Map())
    const incorrect = Object.values(incorrectHits).reduce(addToMapOfOccurences, new Map())
    const newProgress = { ...typerData.progress }
    
    for (const [kana, times] of correct)
      newProgress[kana] = (newProgress[kana] || 0) + times
    
    for (const [kana, times] of incorrect)
      newProgress[kana] = Math.abs((newProgress[kana] || 0) - times)

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
      // console.debug(`staging state change for typer filters with new mode ${mode}`)
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
      console.error(`wrong argument 'set' in setFiltersProp`)
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

      // console.debug(`staging state chage for typer filters with new filter ${prop}=${value} in ${set}`)

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
