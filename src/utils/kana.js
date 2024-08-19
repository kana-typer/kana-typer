import { createSeededLCGRand } from "./rand"

export const LONGEST_LETTER_COUNT_PER_MORAE_ALLOWED = 10

/**
 * @param {*} moraArr - mora collection from db, e.g. [{ symbol: 'か', ... }, ...]
 */
export const generateFullMoraMap = (moraArr) => {
  return new Map(moraArr.map(({ symbol, ...rest }) => [symbol, rest]))
}

export const generateSmallModifiers = (moraMap) => {
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

export const generateFilteredMoraMap = (moraMap, smallModifiers, includeFilers = {}, excludeFilters = {}) => {
  // TODO: implement filters
  const yoons = ['ya', 'yu', 'yo']
  const filteredMora = new Map([])

  moraMap.forEach((mora, symbol) => {
    const hasSokuon = mora?.sokuon !== undefined
    const hasYoon = mora?.yoon !== undefined
    const romaji = mora?.furigana?.romaji
    const script = mora?.script
    const items = [{ key: romaji, value: symbol }]

    if (hasSokuon) {
      items.push({
        key: mora.sokuon + romaji,
        value: smallModifiers.sokuon[script] + symbol,
      })
    }

    if (hasYoon) {
      const base = romaji.slice(0, -1)

      yoons.forEach(yoon => {
        const key = base + (mora.yoon === 'y' ? yoon : yoon.charAt(1))
        const value = symbol + smallModifiers.yoon[script][yoon]

        items.push({ key, value })
      
        if (hasSokuon) {
          items.push({
            key: mora.sokuon + key,
            value: smallModifiers.sokuon[script] + value,
          })
        }
      })
    }

    items.forEach(({ key, value }) => {
      if (filteredMora.has(key)) {
        const oldValue = filteredMora.get(key)
        filteredMora.set(key, [...oldValue, value])
      } else {
        filteredMora.set(key, [value])
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
  const choices = Array.from(moraMap.values()).flat()
  const chosen = []

  let size = 0
  let maxNumOfMisses = 5

  while (size < amount) {
    const idx = Math.floor(rand() * choices.length)
    const pick = choices[idx]

    if (countingSpecificity === 'mora') {
      if (pick.length + size > amount && maxNumOfMisses > 0) {
        maxNumOfMisses -= 1
        continue
      }

      size += pick.length
    } else {
      size += 1
    }

    chosen.push(pick)
  }

  return chosen
}