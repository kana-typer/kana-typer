import kanaUnicodes from '../data/unicode-map.json'


const hiraganaMap = kanaUnicodes.hiragana.array.reduce((acc, kana, index) => (
  { ...acc, [(parseInt(kanaUnicodes.hiragana.count.start, 16) + index).toString(16)]: kana }
), {})


export const unicodeToString = (hex) => String.fromCodePoint(parseInt(hex, 16))

export const stringToUnicode = (char) => char.codePointAt(0)?.toString(16) || ''


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

export function checkRomaji(romaji, combinations) {
  if (romaji.length > 10) // possible longest string one morae combination can create when written in romaji
    return false

  if ('aiueo'.split('').some(mora => romaji.endsWith(mora))) // romaji ends on vowel - may be valid morae
    return combinations.includes(romaji) // check against valid combinations

  if (romaji === 'n' && combinations.includes(romaji)) // specific check for morae n
    return true

  return undefined // not finished typing
}

/**
 * 
 * @param {string} romaji - hiragana representation in romaji
 */
export function romajiToHiragana(romaji) {
  console.log(hiraganaMap)
}
