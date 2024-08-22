import { createSeededLCGRand } from "./rand"

export const LONGEST_LETTER_COUNT_PER_MORAE_ALLOWED = 10

/**
 * @param {*} moraArr - mora collection from db, e.g. [{ symbol: 'か', ... }, ...]
 */
// export const generateFullMoraMap = (moraArr) => {
//   return new Map(moraArr.map(({ symbol, ...rest }) => [symbol, rest]))
// }

export const generateMoraModifiers = (moraMap) => { // TODO: not a map, an object - change it
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

  moraMap.forEach(mora => {
    const romaji = mora?.furigana?.romaji 
    if (romaji === 'tsu') 
      modifiers.sokuon[mora?.script] = mora?.small
    else if (['ya', 'yu', 'yo'].includes(romaji))
      modifiers.yoon[mora?.script][romaji] = mora?.small
  })

  return modifiers
}

const pickFurigana = (furigana, progressLevel) => { // TODO: furigana is object, add javadocs
  const hasHiraganaAsFurigana = furigana?.hiragana !== undefined
  const quantityOffset = hasHiraganaAsFurigana ? 0 : 5

  if (progressLevel === undefined || progressLevel < 5 + quantityOffset)
    return furigana?.romaji || ''

  else if (progressLevel < 10 + quantityOffset)
    return furigana?.hiragana || ''

  return ''
}

export const generateFilteredMoraMap = (
  sourceMap, // TODO: not a map, an object - change it
  userProgressLevels,
  moraModifiers, 
  includeFilers = {}, 
  excludeFilters = {}
) => {
  const yoons = ['ya', 'yu', 'yo']
  const filteredMora = new Map([])

  sourceMap.forEach(({ symbol, ...mora }) => {
    const hasSokuon = mora?.sokuon !== undefined
    const hasYoon = mora?.yoon !== undefined
    const romaji = mora?.furigana?.romaji
    const script = mora?.script
    const furigana = mora?.furigana

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
        progressLevel: userProgressLevels?.[symbol] || 0, // TODO: ka or kka? To be specified still so replace it later if needed
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
 * @param {Map<string, string[]>} moraMap - map of mora to choose from, where key is romaji and value is array of morae
 * @param {{ amount: number, countingSpecificity: 'mora'|'morae', seed: number }} - specify an amount of mora/morae to generate and how counting will be done: mora - counts each individual symbol (e.g. sha = 2), morae - counts every individual sound (e.g. sha = 1)
 */
export const getRandomMora = (moraMap, { amount, countingSpecificity = 'mora', seed }) => {
  const rand = createSeededLCGRand(seed ?? '12345')

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