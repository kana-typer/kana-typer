import kanaUnicodes from '../data/unicode-map.json'


const LONGEST_MORAE_COMBINATION = 10
export const hiraganaMap = parseUnicodeMap(kanaUnicodes)


export const unicodeToKana = (hex) => String.fromCodePoint(parseInt(hex, 16)) // '304b' -> 'か'

export const unicodeToRomaji = (hex) => hiraganaMap?.[hex] || '' // '304b' -> 'ka'

export const kanaToUnicode = (char) => char.codePointAt(0)?.toString(16) || '25a1' // 'か' -> '304b'

export const kanaToRomaji = (char) => unicodeToRomaji(kanaToUnicode(char)) // 'か' -> 'ka'


/**
 * Returns array with valid romaji combinations for given array of morae.
 * @param {Array<string>} moraeUnicodeArray - e.g. ['3063', '3066'] // って
 * @returns array with possible inputs using romaji
 */
export function getInputCombinations(moraeUnicodeArray) {
  const moraeArray = moraeUnicodeArray.map(code => hiraganaMap[code])
  const combinations = [moraeArray.join('')]

  if (moraeArray.length > 1) {
    const isSokuon = moraeArray[0] === 'xtsu'
    const isYoon = moraeArray[moraeArray.length - 1].includes('x')

    const mainMoraIndex = isSokuon ? 1 : 0
    const mainMora = moraeArray[mainMoraIndex]

    if (isSokuon && isYoon) { // xtsu chi xya -> ccha
      let doubleConsonant = mainMora.charAt(0) === 'c' ? 't' : mainMora.charAt(0)
      let yoonSliceValue = ['sh', 'ch'].includes(mainMora.slice(0, 2)) || mainMora.charAt(0) === 'j' ? -1 : 1
      let morphedYoon = mainMora.slice(0, -1) + moraeArray[moraeArray.length - 1].slice(yoonSliceValue)
      combinations.push(doubleConsonant + morphedYoon)
    }

    if (isSokuon) { // xtsu chi -> cchi
      let doubleConsonant = mainMora.charAt(0) === 'c' ? 't' : mainMora.charAt(0)
      let rest = moraeArray.slice(mainMoraIndex).join('')
      combinations.push(doubleConsonant + rest)
    }

    if (isYoon) { // chi xya -> cha
      let yoonSliceValue = ['sh', 'ch'].includes(mainMora.slice(0, 2)) || mainMora.charAt(0) === 'j' ? -1 : 1
      let morphedYoon = mainMora.slice(0, -1) + moraeArray[moraeArray.length - 1].slice(yoonSliceValue)
      let rest = moraeArray.slice(0, mainMoraIndex).join('')
      combinations.push(rest + morphedYoon)
    }
  }

  return combinations
}

/**
 * Checks given romaji if its correct, incorrect or unfinished based on array of possible combinations.
 * @param {string} romaji - e.g. cha
 * @param {Array<string>} combinations - possible input combinations of morae, e.g. ['cha', 'chixya']
 * @returns `true` if correct, `false` if incorrect, `undefined` if given romaji is not a valid combination of morae
 */
export function checkRomaji(romaji, combinations) {
  if (romaji.length > LONGEST_MORAE_COMBINATION) // possible longest string one morae combination can create when written in romaji
    return false

  if ('aiueo'.split('').some(mora => romaji.endsWith(mora))) // romaji ends on vowel - may be valid morae
    return combinations.includes(romaji) // check against valid combinations

  if (romaji === 'n' && combinations.includes(romaji)) // specific check for morae n
    return true

  return undefined // not finished typing
}

// TODO: change return type from object to Map: https://www.w3schools.com/js/js_maps.asp
/**
 * Parses an array of romaji and unicode chars tied to it, creating a map. 
 * @param {*} map - unicode map object from db
 * @returns {{ [unicode: string]: string }} map object with unicode as keys and romaji representation as values
 */
export function parseUnicodeMap(map) {
  return map.hiragana.array.reduce((acc, kana, index) => (
    map.hiragana.except.includes(kana)
      ? acc
      : { ...acc, [(parseInt(kanaUnicodes.hiragana.count.start, 16) + index).toString(16)]: kana }
  ), {})
}
