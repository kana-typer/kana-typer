import hiragana from '../../data/hiragana.json'
import maps from '../../data/new/romaji-maps.json'

/**
 * dane hiragany:
 *  - tabelka z tymi podstawowymi dzwiekami (tu zamiast tsu itd) zeby sie zadnie nie powtarzaly
 *    ta tabelka bedzie tez unicode'ami
 *    w tabelce beda male znaki wiec trzeba je jakos zaznaczac, sugeruje przez x na poczatku
 *  - bedzie obiekt ktory kluczami bedzie mial te dzwieki i bedzie mial dane typu
 *    - czy moze byc dodane z tsu na poczatku
 *    - czy moze byc modyfikowane z ya, yu, yo
 *    - itp.
 */


const VOWELS = 'aiueo'
const CONSONANTS = 'kgszjtcdnhbpmyrw'


const isVowel = (char) => VOWELS.includes(char)

const isConsonant = (char) => CONSONANTS.includes(char)

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
      if (morae.charAt(0) === morae.charAt(1)) {
        buffer[i] = ['xtu', morae.slice(1)] // TODO: implement better sokuon parsing
    }
  }

  console.log(buffer)
}

const isSokuon = (romaji) => { // small tsu
  /**
   * Possibilities:
   * kka
   * gga
   * ssa, sshi
   * zza, jji, zji?
   * tta, cchi, tchi, ttsu
   * dda, dji?, dzu?
   * nna
   * hha
   * bba
   * ppa
   * mma
   * yya
   * rra
   * wwa
   */

  const sokuon = ['xtsu', 'xtu', 'ltsu', 'ltu']
  const allowedPreConsonants = { 'j': 'z', 'c': 't' }

  const doubleConsonantToleranceMatched = (romaji) => romaji.charAt(1) in allowedPreConsonants && allowedPreConsonants[romaji.charAt(1)].includes(romaji.charAt(0))

  //i: GUARD sokuon cannot be shorter than 3 romaji characters
  if (romaji.length < 3) return false

  // if sokuon is part of romaji, e.g. xtsumo != mmo
  if (sokuon.some(tsu => romaji.startsWith(tsu))) {
    // TODO: check if stuff after tsu is valid
    return true
  } 

  //i: GUARD first and second character must be consonants
  if (!isConsonant(romaji.charAt(0)) || !isConsonant(romaji.charAt(1))) return false

  //i: GUARD two first consonants must be the same or have an allowed combination, e.g. cchi/tchi
  if (romaji.charAt(0) !== romaji.charAt(1) && !doubleConsonantToleranceMatched(romaji)) return false

  // TODO: check if stuff after double consonants is valid, same check as above with tsu, but take second consonant along
}


const isYoon = () => { // cha
  //i: GUARD yoon cannot be shorter than 3 romaji characters
  if (romaji.length < 3) return false

  
}

const isHatsuon = (romaji) => {} // sole n



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

export function romajiToSounds(romaji) {
  let buffer = ''

  /**
   * Possibilities:
   *    a - vowel letter
   *    xa - small letter, vowel letter
   *    xtsu - small letter, t family, must be xtsu, vowel letter
   *    ka - k family, vowel letter
   *    ne - n family, vowel letter
   *    shi - s family, must be shaiueo, vowel letter
   *    chi - c(t) family, must be chaiueo, vowel letter
   *    yu - y family, vowel letter
   *    ji - j(z) family, vowel letter
   *    bba - b family, combined with xtsu, vowel letter
   *    ttsu - t family, combined with xtsu, must be ttsu, vowel letter
   *    kya - k family, combined with ya, vowel letter
   *    sha - s family, must be shaiueo, vowel letter
   *    cho - c(t) family, must be chaiueo, vowel letter
   *    ccha - c(t) family, combined with xtsu, must be chaiueo, vowel letter
   *    n - n family but not really !!
   */

  for (const char of romaji) {
    buffer += char

    if (isVowel(buffer[buffer.length - 1])) {
      console.log(`sound: ${buffer}`)
      buffer = ''
    }
  }
}