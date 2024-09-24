import { createSeededLCGRand } from "./rand"

export const LONGEST_LETTER_COUNT_PER_MORAE_ALLOWED = 10

/**
 * Generates an object of small symbols for specific kana modifications in specific scripts, e.g. turning `'か'` to `'っか'`.
 * @param {Array<{ furigana?: { romaji?: string, hiragana?: string }, script?: string, small?: string }>} moraObj - an array of objects, in which any of the listed properties can be null, but will lead to incomplete data, rather than an error.
 * @returns {{ sokuon: { hiragana: string | null, katakana: string | null }, yoon: { hiragana: { ya: string | null, yu: string | null, yo: string | null }, katakana: { ya: string | null, yu: string | null, yo: string | null } } }} null in any of the slots if no proper symbol was found
 */
export const generateMoraModifiers = (moraObj) => {
  const modifiers = {
    sokuon: { 
      hiragana: null, 
      katakana: null 
    },
    yoon: { 
      hiragana: { ya: null, yu: null, yo: null }, 
      katakana: { ya: null, yu: null, yo: null },  
    },
  }

  moraObj.forEach(mora => {
    const romaji = mora?.furigana?.romaji 
    if (romaji === 'tsu') 
      modifiers.sokuon[mora?.script] = mora?.small
    else if (['ya', 'yu', 'yo'].includes(romaji))
      modifiers.yoon[mora?.script][romaji] = mora?.small
  })

  return modifiers
}

/**
 * Picks proper furigana if one exists, otherwise returns no furigana.
 * @param {{ romaji?: string, hiragana?: string }} furigana - object comprised of possible furigana variations for an undisclosed symbol or word
 * @param {*} progressLevel - level of progress in symbol or word. Dictates the returned furigana, if one exists
 * @returns {string} proper furigana based on `progressLevel`, but at high enough level or pick some furigana missing, returns an empty string
 */
const pickFurigana = (furigana, progressLevel) => {
  const hasHiraganaAsFurigana = furigana?.hiragana !== undefined
  const quantityOffset = hasHiraganaAsFurigana ? 0 : 5

  if (progressLevel === undefined || progressLevel < 5 + quantityOffset)
    return furigana?.romaji || ''

  else if (progressLevel < 10 + quantityOffset)
    return furigana?.hiragana || ''

  return ''
}

/**
 * Generated a Map object that comprises every possible combination for kana based on given modifiers and filters.
 * @param {{ symbol: string, furigana?: { romaji?: string, hiragana?: string }, script?: string, extended?: bool, type?: string, small?: string, sokuon?: string, yoon?: '' | string }} sourceObj - raw object of all basic kana. Extended kana is treated as basic kana as it has unique, non-repeatable rules.
 * @param {{ [symbol: string]: number }} userProgressLevels - specifies progress level for some symbols, which directs given furigana.
 * @param {{ sokuon: { hiragana: string | null, katakana: string | null }, yoon: { hiragana: { ya: string | null, yu: string | null, yo: string | null }, katakana: { ya: string | null, yu: string | null, yo: string | null } } }} moraModifiers - object used for creating modifications based on specifications given in `sourceObj`.
 * @param {{}} includeFilers - filters that specify inclusion of symbols based on their properties, e.g. `{ script: hiragana }` includes only symbols that correspond to hiragana.
 * @param {{}} excludeFilters - filters that specify exclusion of symbols based on their properties, e.g. `{ script: hiragana }` excludes every symbol that corresponds to hiragana.
 * @returns {Map<string, Array<{ symbol: string, progressLevel: number, furigana: string }>>} a Map object which keys are romaji representations of kana, and values which are sets of objects that could correspond to given romaji.
 */
export const generateFilteredMoraMap = (
  sourceObj,
  userProgressLevels,
  moraModifiers, 
  includeFilers = {}, // TODO: implement inclusion and exclusion filters
  excludeFilters = {}
) => {
  const yoons = ['ya', 'yu', 'yo']
  const filteredMora = new Map([])

  sourceObj.forEach(({ symbol, ...mora }) => {
    const hasSokuon = mora?.sokuon !== undefined
    const hasYoon = mora?.yoon !== undefined
    const romaji = mora?.furigana?.romaji || ''
    const script = mora?.script || 'hiragana'
    const furigana = mora?.furigana || ''

    const items = [
      { 
        key: romaji, 
        symbol: symbol,
        progressLevel: userProgressLevels?.[symbol] || 0, // TODO: change?
        furigana: pickFurigana(furigana, userProgressLevels?.[symbol]),
      },
    ]

    if (hasSokuon) {
      const sokuonRomaji = mora.sokuon + romaji
      const sokuonSymbol = moraModifiers.sokuon[script] + symbol
      const sokuonFurigana = {}

      if (furigana?.romaji !== undefined)
        sokuonFurigana.romaji = sokuonRomaji

      if (furigana?.hiragana !== undefined)
        sokuonFurigana.hiragana = moraModifiers.sokuon.hiragana + furigana.hiragana

      items.push({
        key: sokuonRomaji, 
        symbol: sokuonSymbol,
        progressLevel: userProgressLevels?.[symbol] || 0, // TODO: ka or kka for kka? To be specified still so replace it later if needed
        furigana: pickFurigana(sokuonFurigana, userProgressLevels?.[symbol]),
      })
    }

    if (hasYoon) {
      const base = romaji.slice(0, -1)

      yoons.forEach(yoon => {
        const yoonRomaji = base + (mora.yoon === 'y' ? yoon : yoon.charAt(1))
        const yoonSymbol = symbol + moraModifiers.yoon[script][yoon]
        const yoonFurigana = {}

        if (furigana?.romaji !== undefined)
          yoonFurigana.romaji = yoonRomaji

        if (furigana?.hiragana !== undefined)
          yoonFurigana.hiragana = furigana.hiragana + moraModifiers.yoon.hiragana[yoon]

        items.push({ 
          key: yoonRomaji, 
          symbol: yoonSymbol,
          progressLevel: userProgressLevels?.[symbol] || 0, // TODO: change?
          furigana: pickFurigana(yoonFurigana, userProgressLevels?.[symbol]),
        })
      
        if (hasSokuon) {
          const sokuonYoonRomaji = mora.sokuon + yoonRomaji
          const sokuonYoonSymbol = moraModifiers.sokuon[script] + yoonSymbol
          const sokuonYoonFurigana = {}

          if (furigana?.romaji !== undefined)
            sokuonYoonFurigana.romaji = sokuonYoonRomaji
  
          if (furigana?.hiragana !== undefined)
            sokuonYoonFurigana.hiragana = moraModifiers.sokuon.hiragana + yoonFurigana.hiragana

          items.push({
            key: sokuonYoonRomaji, 
            symbol: sokuonYoonSymbol,
            progressLevel: userProgressLevels?.[symbol] || 0, // TODO: change?
            furigana: pickFurigana(sokuonYoonFurigana, userProgressLevels?.[symbol]),
          })
        }
      })
    }

    items.forEach(({ key, ...data }) => {
      if (filteredMora.has(key)) {
        filteredMora.set(key, [...filteredMora.get(key), data])
      } else {
        filteredMora.set(key, [data])
      }
    })
  })

  return filteredMora
}

/**
 * @param {Map<string, Array<{ symbol: string, furigana: string }>>} moraMap - map of mora to choose from, where key is romaji and value is array of morae.
 * @param {{ amount: number, countingSpecificity: 'mora'|'morae', seed: number }} options - specify an amount of mora/morae to generate and how counting will be done: mora - counts each individual symbol (e.g. sha = 2), morae - counts every individual sound (e.g. sha = 1)
 * @returns {Array<{ symbol: string, furigana: string }>}
 */
export const getRandomMora = (moraMap, { amount, countingSpecificity = 'mora', seed = '12345' }) => {
  const rand = createSeededLCGRand(seed)

  const chosen = []
  const choices = Array
    .from(moraMap.values())
    .flat()
    .map(({ symbol, furigana }) => ({ symbol, furigana }))

  let size = 0
  let maxNumOfMisses = 5

  while (size < amount) {
    const idx = Math.floor(rand() * choices.length)
    const pick = choices[idx]

    if (countingSpecificity === 'mora') {
      if (pick.symbol.length + size > amount && maxNumOfMisses > 0) {
        maxNumOfMisses -= 1
        continue
      }
      size += pick.symbol.length
    } else {
      size += 1
    }

    chosen.push(pick)
  }

  return chosen
}

/**
 * Checks given `romaji` against given `target` based on source data from given `map`.
 * @param {string} romaji - e.g. `'ka'`.
 * @param {string} target - e.g. `'か'`.
 * @param {Map<string, Array<{ symbol: string }>>} map - source map that has a lookup for romaji and kana they might correspond to.
 * @returns `true` if it's valid romaji for given kana, `false` if it is not and `undefined` if given romaji might not have been typed fully, i.e. is not a valid romaji to make a valid japanese sound.
 */
export const checkRomajiValidity = (romaji, target, map) => {
  // possible longest string one morae combination can create when written in romaji
  if (romaji.length > LONGEST_LETTER_COUNT_PER_MORAE_ALLOWED)
    return false

  const getSymbols = (key) => map.get(key).map(({ symbol }) => symbol)
  const endsOnVowel = 'aiueo'.split('').some(mora => romaji.endsWith(mora))
  const validRomaji = map.has(romaji)

  // romaji ends on vowel - may be valid morae
  if (endsOnVowel && validRomaji) {
    return getSymbols(romaji).includes(target) // check for valid morae
  }

  // specific check for n to not conflict with na, ni, etc.
  if (romaji === 'n' && validRomaji && getSymbols(romaji).includes(target))
    return true

  // romaji might be partial
  return undefined
}