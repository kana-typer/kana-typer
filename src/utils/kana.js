import { createSeededLCGRand } from './rand'
import { isNullOrUndefined } from './types'
import { getCurrentLanguageCode } from './lang'

/**
 * Longest accepted mora count for singular morae, word or kanji.
 */
export const LONGEST_LETTER_COUNT_PER_MORAE_ALLOWED = 16

/**
 * Starting range of furigana, specifying user's progress.
 * This number signifies that furigana cannot go lower than this.
 */
export const FURIGANA_START_RANGE = 0

/**
 * Ending range of furigana for romaji to be accepted.
 * After that, next furigana range should be calculated,
 */
export const FURIGANA_ROMAJI_RANGE = 5

/**
 * Ending range of furigana for hiragana to be accepted (if possible).
 * After than, no help should be given.
 */
export const FURIGANA_HIRAGANA_RANGE = 10

/**
 * By how much should we up the progress of specific symbol and thus decrease help of furigana.
 * It is a multiplier, thus should be used as `x * MULTIPLIER`, where x is the unchanged value of progress.
 */
export const FURIGANA_INCREMENT_MULTIPLIER = 1

/**
 * By how much should we decrease the progress of specific symbol and thus re-add furigana help.
 * It is a multiplier, thus should be used as `x * MULTIPLIER`, where x is the unchanged value of regress.
 */
export const FURIGANA_DECREMENT_MULTIPLIER = 1

/**
 * Enum of mora scripts.
 * This will show up as main categories of typer on sidenav.
 */
export const MORA_SCRIPTS = {
  hiragana: 'hiragana',
  katakana: 'katakana',
}

/**
 * Enum of mora types, i.e. modifications of sounds and their diacritic symbols categorised.
 * This will show up as sub-options for filtering.
 */
export const MORA_TYPES = {
  gojuon: 'gojuon',
  dakuten: 'dakuten',
  handakuten: 'handakuten',
}

/**
 * Categories of word groups.
 * This will show up as main categories of typer on sidenav.
 */
export const WORDS_CATEGORIES = {
  clothes: 'clothes',
  numbers: 'numbers',
  colors: 'colors',
  animals: 'animals',
}

/**
 * Grammatical groups of words.
 * This will show up as sub-options for filtering.
 */
export const WORDS_TYPES = {
  verbs: 'verb',
  nouns: 'noun',
  adjectives: 'adjective',
  particles: 'particle',
  pronouns: 'pronoun',
}

/**
 * Generates still missing mora modifiers based off of given source object.
 * @param {object[]} source - array of objects that might store object that are required to create other, modified mora symbols (e.g. ya)
 * @param {{ sokuon: { hiragana: string | null, katakana: string | null }, yoon: { hiragana: { ya: string | null, yu: string | null, yo: string | null }, katakana: { ya: string | null, yu: string | null, yo: string | null } } }} prevModifiers - object of mora modifiers
 * @returns {{ sokuon: { hiragana: string | null, katakana: string | null }, yoon: { hiragana: { ya: string | null, yu: string | null, yo: string | null }, katakana: { ya: string | null, yu: string | null, yo: string | null } } }} object with mora modifiers set to a string value if any missing (null) modifiers were found and their respective data source found in source object.
 */
export const generateModifiers = (source, prevModifiers) => {
  const getSmallSymbol = (source, script, target) => source
    .filter(obj => obj.script === script)
    .find(obj => obj.furigana.romaji == target)
    ?.small || null

  const data = { ...prevModifiers }

  if (data.sokuon.hiragana === null) {
    data.sokuon.hiragana = getSmallSymbol(source, 'hiragana', 'tsu')
  }

  if (data.sokuon.katakana === null) {
    data.sokuon.katakana = getSmallSymbol(source, 'katakana', 'tsu')
  }

  if (data.yoon.hiragana.ya === null) {
    data.yoon.hiragana.ya = getSmallSymbol(source, 'hiragana', 'ya')
  }

  if (data.yoon.hiragana.yu === null) {
    data.yoon.hiragana.yu = getSmallSymbol(source, 'hiragana', 'yu')
  }

  if (data.yoon.hiragana.yo === null) {
    data.yoon.hiragana.yo = getSmallSymbol(source, 'hiragana', 'yo')
  }

  if (data.yoon.katakana.ya === null) {
    data.yoon.katakana.ya = getSmallSymbol(source, 'katakana', 'ya')
  }

  if (data.yoon.katakana.yu === null) {
    data.yoon.katakana.yu = getSmallSymbol(source, 'katakana', 'yu')
  }

  if (data.yoon.katakana.yo === null) {
    data.yoon.katakana.yo = getSmallSymbol(source, 'katakana', 'yo')
  }

  console.debug('generateModifiers(source =', source, ', prevModifiers =', prevModifiers, ') =>', data)
  return data
}

/**
 * Based off of hard-coded ranges, returns either romaji furigana, hiragana furigana or no furigana based off of user progress data.
 * @param {{ hiragana: string | null, reading: string | null }} furigana - object with additional reading information
 * @param {{ [key: string]: number }} progress - user's progress object on symbol whose currently passed furigana is part of
 * @returns {string} proper furigana in text format or an empty string in case of an unexpected behavior.
 */
export const pickFurigana = (furigana, progress) => {
  const hasHiragana = furigana?.hiragana !== undefined
  // if there is no hiragana furigana, then romaji furigana range is extended for easier learning
  const quantityOffset = hasHiragana ? FURIGANA_START_RANGE : FURIGANA_ROMAJI_RANGE

  const isForRomaji = isNullOrUndefined(progress) || progress < FURIGANA_ROMAJI_RANGE + quantityOffset
  const isForHiragana = progress < FURIGANA_HIRAGANA_RANGE + quantityOffset

  console.debug("pickFurigana(furigana =", furigana,", progress =", progress, ") FURIGANA_START_RANGE =", FURIGANA_START_RANGE, " FURIGANA_ROMAJI_RANGE =", FURIGANA_ROMAJI_RANGE, ") =>", isForRomaji ? furigana?.romaji || '' : isForHiragana ? furigana?.hiragana || '' : '')

  if (isForRomaji)
    return furigana?.romaji || ''

  else if (isForHiragana)
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
export const generateMoraMap = (source, modifiers, progress, filters) => {
  const yoons = ['ya', 'yu', 'yo']
  const map = new Map([])

  source.forEach(({ symbol, ...mora }) => {
    const hasSokuon = !isNullOrUndefined(mora?.sokuon)
    const hasYoon = !isNullOrUndefined(mora?.yoon)
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

        if (!isNullOrUndefined(furigana?.romaji))
          sokuonFurigana.romaji = sokuonRomaji

        if (!isNullOrUndefined(furigana?.hiragana))
          sokuonFurigana.hiragana = modifiers.sokuon.hiragana + furigana.hiragana

        items.push({
          key: sokuonRomaji,
          kana: sokuonSymbol,
          furigana: pickFurigana(sokuonFurigana, progress?.[sokuonSymbol]), // i: kka is treated as ka; tte as te; etc.
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

          if (!isNullOrUndefined(furigana?.romaji))
            yoonFurigana.romaji = yoonRomaji

          if (!isNullOrUndefined(furigana?.hiragana))
            yoonFurigana.hiragana = furigana.hiragana + modifiers.yoon.hiragana[yoon]

          items.push({
            key: yoonRomaji,
            kana: yoonSymbol,
            furigana: pickFurigana(yoonFurigana, progress?.[yoonSymbol]), // i: kya, kyu, kyo are treated as ki; cha, chu, cho as chi; etc.
            translation: null,
            reading: null,
          })

          if (hasSokuon && filters.sokuon === true) {
            const bothRomaji = mora.sokuon + yoonRomaji
            const bothSymbol = modifiers.sokuon[script] + yoonSymbol
            const bothFurigana = {}

            if (!isNullOrUndefined(furigana?.romaji))
              bothFurigana.romaji = bothRomaji
    
            if (!isNullOrUndefined(furigana?.hiragana))
              bothFurigana.hiragana = modifiers.sokuon.hiragana + yoonFurigana.hiragana

            items.push({
              key: bothRomaji,
              kana: bothSymbol,
              furigana: pickFurigana(bothFurigana, progress?.[bothSymbol]), // i: kkya, kkyu, kkte are treated as ki; tcha, tchu, tche as chi; etc.
              translation: null,
              reading: null,
            })
          }
        })
      }
    }

    console.debug('generateMoraMap(source =', source, ', modifiers =', modifiers, ', progress =', progress, ', filters =', filters, ') foreach symbol =', symbol, ': rest =', mora, 'skip =', skip, ' (scripts, types, extended) sokuon =', hasSokuon && filters.sokuon === true, 'yoon =', hasYoon && filters.yoon === true, 'items =', items)

    items.forEach(({ key, ...data }) => {
      if (map.has(key)) {
        map.set(key, [...map.get(key), data])
      } else {
        map.set(key, [data])
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
 * @param {object[]} filters - user-selected filters to generate only those words that were specified by the user - if accepted words are not included in source object and therefore cannot be  generated, there is likely a bug somewhere else before this function call
 * @returns {Map<string, Array<{ key: string, kana: string, furigana: string, translation: string | null, reading: string | null }>>} a map of all possible combinations with only the data  necessary to generate a randomly chosen typer pool and proper UX
 */
export const generateWordsMap = (source, progress, filters) => {
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
        translation: word?.translation?.[getCurrentLanguageCode()] || '',
        reading: word?.furigana?.reading || null,
      })
    }

    console.debug('generateWordsMap(source =', source, ', progress =', progress, ', filters =', filters, ') foreach kana =', kana, ': rest =', word, 'skip =', skip, ' (categories, types) items =', items)

    items.forEach(({ key, ...data }) => {
      if (map.has(key)) {
        map.set(key, [...map.get(key), data])
      } else {
        map.set(key, [data])
      }
    })
  })

  return map
}

/**
 * Picks a random object from the given map.
 * TODO: function might sometimes not be able to pick any item if we are unlucky enoug, I think...
 * @param {number} amount - how many kana to generate
 * @param {Map<string, Array<{ kana: string }>>} sourceMap - source of random picking
 * @param countingSpecificity - what type of kana counting should be used: 'mora' - counts every single mora in kana string, so that amount is roughly equal to total count of mora in picks; 'morae' - counts every pick to be decremented by 1 from amount
 * @param seed - seed for LCG pseudo-random number generator
 * @param maxNumOfMisses - maximum number of possible misses, after which random-picker loop stops executing
 * @returns {object[]} array of randomly picked objects.
 */
export const getRandomKanaFromMap = (amount, sourceMap, { countingSpecificity = 'mora', seed = 12345, maxNumOfMisses = 5 } = {}) => {
  if (sourceMap === null || sourceMap.size === 0) {
    console.error(`source map is empty - ${sourceMap}`)
    return []
  }

  const rand = createSeededLCGRand(seed)

  const chosen = []
  const choices = Array
    .from(sourceMap.values())
    .flat()

  let size = 0
  while (size < amount) {
    const idx = Math.floor(rand() * choices.length)
    const pick = choices[idx]

    if (countingSpecificity === 'mora') {
      if (pick.kana.length + size > amount && maxNumOfMisses > 0) {
        maxNumOfMisses -= 1
        continue
      }
      size += pick.kana.length
    } else {
      size += 1
    }

    chosen.push(pick)
  }

  console.debug('getRandomKanaFromMap(amount =', amount, ', sourceMap =', sourceMap, ', { countingSpecificity =', countingSpecificity, ', seed =', seed, ', maxNumOfMisses =', maxNumOfMisses, ' }) (choises =', choices, ') => chosen =', chosen)

  return chosen
}

/**
 * Checks validity of given romaji against source map based on the actual kana (hiragana, katakana or kanji).
 * @param {string} givenRomaji - romaji to check for validity
 * @param {string} targetKana - actual hiragana, katakana or kanji to check against
 * @param {Map<string, Array<{ kana: string }>>} sourceMap - a map of all possible combinations in current typer game
 * @returns {boolean} true if romaji is valid with kana, false if it is not valid or undefined if it could not yet be specified, because of, for example, not yet valid romaji sequence
 */
export const checkRomajiValidityOfKana = (givenRomaji, targetKana, sourceMap) => {
  if (givenRomaji.length > LONGEST_LETTER_COUNT_PER_MORAE_ALLOWED)
    return false

  const getKana = (key) => sourceMap.get(key)?.map(({ kana }) => kana) || []
  const validRomajis = [...sourceMap.keys()].filter(romaji => romaji.includes(givenRomaji))
  const hasCorrectKana = validRomajis.reduce((acc, romaji) => [...acc, ...getKana(romaji)], []).includes(targetKana)

  const endsOnVowel = 'aiueo'.split('').some(vowel => givenRomaji.endsWith(vowel))
  const endsOnN = givenRomaji.endsWith('n')

  const validRomaji = sourceMap.has(givenRomaji)
  const kanaInMap = getKana(givenRomaji).includes(targetKana)

  console.debug('checkRomajiValidityOfKana(givenRomaji =', givenRomaji, ', targetKana =', targetKana, ', sourceMap =', sourceMap, ') (getKana =, ', getKana(givenRomaji), 'validRomajis =, ', validRomajis, 'hasCorrectKana =, ', hasCorrectKana, 'endsOnVowel =', endsOnVowel, ', validRomaji =', validRomaji, ', kanaInMap =', kanaInMap, ')')

  // check if romaji might be valid
  if ((endsOnVowel || endsOnN) && validRomaji) {

    // romaji has no plausible kana found
    if (validRomajis.length === 0 || !hasCorrectKana)
      return false

    // romaji has correct kana but it is the wrong kana
    if (hasCorrectKana && !kanaInMap)
      return undefined

    // correct kana
    return true
  }

  // not valid romaji - plausibly not done typing
  return undefined
}
