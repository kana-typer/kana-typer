import maps from '../../data/new/romaji-maps.json'


const VOWELS = 'aiueo'


const isVowel = (char) => VOWELS.includes(char)

const isConsonant = (char) => !VOWELS.includes(char)

const splitOnVowels = (romaji) => {
  let index = 0
  let buffer = []

  // splitting on vowels
  for (let i = 0; i < romaji.length; i++) {
    const char = romaji.charAt(i)
    buffer?.[index] ? buffer[index] += char : buffer[index] = char
    
    if (char === 'n' && i + 1 < romaji.length && !isVowel(romaji.charAt(i + 1)) && romaji.charAt(i + 1) !== 'y')
      index++

    else if (isVowel(char))
      index++
  }

  // splitting to separate, unique morae
  for (let i = 0; i < buffer.length; i++) {
    const morae = buffer[i]
    const matches = maps.typing.reduce((acc, mora, idx) => mora === morae ? [...acc, { mora, idx }] : acc, [])

    if (matches.length === 1) {
      buffer[i] = maps.unique?.[maps.typing.indexOf(morae)] || morae
    }
    else if (matches.length > 1) { // TODO: implement code that will decide which typing should be chosen
      buffer[i] = maps.unique?.[matches[0].idx] || morae
    }
    else {
      if (morae.charAt(0) === morae.charAt(1)) 
        buffer[i] = ['xtu', morae.slice(1)] // TODO: implement better sokuon parsing

      else if ('auo'.includes(morae.charAt(morae.length - 1)))
        buffer[i] = [morae.charAt(0) + 'i', 'y' + morae.charAt(morae.length - 1)] // TODO: implement better yoon parsing
    }
  }

  console.log(buffer)
}

/**
 * 
 * @param {string} romaji - hiragana representation in romaji
 */
export function romajiToHiragana(romaji) {
  // console.log(hiragana)

  splitOnVowels(romaji)

  // let buffer = []
  // let index = 0

  // console.log(buffer?.[index])

  // for (const char of romaji) {
  //   if (buffer?.[index] === undefined)
  //     buffer[index] = { chars: [] }


  // }
}