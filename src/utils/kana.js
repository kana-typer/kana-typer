import hiragana from '../data/hiragana.json'


export const validRomaji = () => {}

export const isN = () => {}

export const isSokuon = () => {}

export const isYoon = () => {}


/**
 * 
 * @param {string} romaji - hiragana representation in romaji
 */
export function romajiToHiragana(romaji) {
  console.log(hiragana)
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
    
  }
}