import { expect, test, beforeAll, describe, beforeEach } from 'vitest'
import * as kana from '../kana'
import kanaUnicodes from '../../data/unicode-map.json'
import data from './kana.json'


// let hiraganaMap     // { unicode: romaji, ... }
// let excludedKeys    // [ unicode, ... ]
// let excludedValues  // [ romaji, ... ]


// beforeAll(() => {
//   hiraganaMap = {
//     '3042': 'a',
//     '3044': 'i',
//     '3046': 'u',
//     '3048': 'e',
//     '3050': 'gu',
//     '3051': 'ke',
//     '3052': 'ge',
//     '3053': 'ko',
//     '3054': 'go',
//     '3055': 'sa',
//     '3056': 'za',
//     '3057': 'shi',
//     '3058': 'ji',
//     '3059': 'su',
//     '3060': 'da',
//     '3061': 'chi',
//     '3062': 'ji',
//     '3063': 'xtsu',
//     '3064': 'tsu',
//     '3065': 'zu',
//     '3066': 'te',
//     '3067': 'de',
//     '3068': 'to',
//     '3069': 'do',
//     '3070': 'ba',
//     '3071': 'pa',
//     '3072': 'hi',
//     '3073': 'bi',
//     '3074': 'pi',
//     '3075': 'fu',
//     '3076': 'bu',
//     '3077': 'pu',
//     '3078': 'he',
//     '3079': 'be',
//     '3080': 'mu',
//     '3081': 'me',
//     '3082': 'mo',
//     '3083': 'xya',
//     '3084': 'ya',
//     '3085': 'xyu',
//     '3086': 'yu',
//     '3087': 'xyo',
//     '3088': 'yo',
//     '3089': 'ra',
//     '3092': 'wo',
//     '3093': 'n',
//     '304a': 'o',
//     '304b': 'ka',
//     '304c': 'ga',
//     '304d': 'ki',
//     '304e': 'gi',
//     '304f': 'ku',
//     '305a': 'zu',
//     '305b': 'se',
//     '305c': 'ze',
//     '305d': 'so',
//     '305e': 'zo',
//     '305f': 'ta',
//     '306a': 'na',
//     '306b': 'ni',
//     '306c': 'nu',
//     '306d': 'ne',
//     '306e': 'no',
//     '306f': 'ha',
//     '307a': 'pe',
//     '307b': 'ho',
//     '307c': 'bo',
//     '307d': 'po',
//     '307e': 'ma',
//     '307f': 'mi',
//     '308a': 'ri',
//     '308b': 'ru',
//     '308c': 're',
//     '308d': 'ro',
//     '308f': 'wa'
//   }
//   excludedValues = kanaUnicodes.hiragana.except
//   excludedKeys = excludedValues.map(searchingValue => {
//     let array = kanaUnicodes.hiragana.array
//     let index = array.findIndex(value => value === searchingValue)
//     let unicode = (parseInt(kanaUnicodes.hiragana.count.start, 16) + index).toString(16)
//     return unicode
//   })
// })


describe('Parsing from DB', () => {
  let hiraganaMap     // { unicode: romaji, ... }
  let excludedKeys    // [ unicode, ... ]
  let excludedValues  // [ romaji, ... ]

  beforeAll(() => {
    hiraganaMap = kana.parseUnicodeMap(kanaUnicodes)
    excludedValues = kanaUnicodes.hiragana.except
    excludedKeys = excludedValues.map(searchingValue => {
      let array = kanaUnicodes.hiragana.array
      let index = array.findIndex(value => value === searchingValue)
      let unicode = (parseInt(kanaUnicodes.hiragana.count.start, 16) + index).toString(16)
      return unicode
    })
    console.log(excludedKeys)
  })

  test('parseUnicodeMap has proper keys as unicodes in hex string', () => {
    const keys = Object.keys(hiraganaMap)
    
    for (let i = 0; i < kanaUnicodes.hiragana.count.length; i++) {
      let unicode = (parseInt(kanaUnicodes.hiragana.count.start, 16) + i).toString(16)
      let isExcluded = excludedKeys.includes(unicode)

      expect(keys.includes(unicode)).toBe(isExcluded ? false : true)
    }
  })

  test('parseUnicodeMap has proper values as romaji in string', () => {
    const values = Object.values(hiraganaMap)

    for (const romaji of kanaUnicodes.hiragana.array) {
      let isExcluded = excludedValues.includes(romaji)

      expect(values.includes(romaji)).toBe(isExcluded ? false : true)
    }
  })

  test('parseUnicodeMap has proper key:value pairs based on unicode in map', () => {
    for (const [unicode, romaji] of Object.entries(hiraganaMap)) {
      // get index of romaji based on given unicode and starting unicode
      let romajiIndex = parseInt(unicode, 16) - parseInt(kanaUnicodes.hiragana.count.start, 16)

      // find romaji based on its position in array
      let matchingRomaji = kanaUnicodes.hiragana.array.find((_, index) => index === romajiIndex)

      expect(romaji === matchingRomaji).toBe(true)
    }
  })

  test('parseUnicodeMap has proper key:value pairs based on romaji in map', () => {
    for (const [unicode, romaji] of Object.entries(hiraganaMap)) {
      // find even duplicate matches, e.g. ji can be made from shi and chi
      let unicodeIndices = kanaUnicodes.hiragana.array.reduce((acc, value, index) => (
        value === romaji
          ? [...acc, index]
          : acc
      ), [])

      // make sure to not get duplicate unicodes, e.g. ji from shi is different than when from chi
      let matchingUnicodes = unicodeIndices.reduce((acc, position) => {
        let code = (parseInt(kanaUnicodes.hiragana.count.start, 16) + position).toString(16)

        if (!acc.includes(code))
          acc.push(code)

        return acc
      }, [])

      expect(matchingUnicodes.includes(unicode)).toBe(true)
    }
  })
})

describe('Helper functions', () => {
  test('unicodeToKana, given hex string, returns kana symbol', () => {
    expect(kana.unicodeToKana('304b')).toBe('か')
  })

  test('unicodeToRomaji, given hex string, returns romaji string', () => {
    expect(kana.unicodeToRomaji('304b')).toBe('ka')
  })

  test('kanaToUnicode, given kana symbol, returns hex string', () => {
    expect(kana.kanaToUnicode('か')).toBe('304b')
  })

  test('kanaToRomaji, given kana symbol, returns romaji string', () => {
    expect(kana.kanaToRomaji('か')).toBe('ka')
  })
})

describe('Core functions', () => {
  const combinationsMap = new Map()

  test('getInputCombinations returns valid combinations', () => {
    // TODO: check if combinations are valid and then check checkRomaji
  })


  // beforeAll(() => {
  //   const hiraganaMap = kana.parseUnicodeMap(kanaUnicodes)

  //   for (const [key, value] of Object.entries(hiraganaMap)) {
  //     // standard mora
  //     combinationsMap.set(value, kana.getInputCombinations([key]))

  //     if (value.length > 1 && value.endsWith('i')) {
  //       combinationsMap.set(value, kana.getInputCombinations([]))
  //     }
  //   }


  // })
})

// useEffect(() => {
  // romajiToHiragana('kattechannyaji')
  // getInputCombinations('ka', visibleKana[checkingIndex])

  // chijimeru -> ちぢめる
  // tsuzuku -> つづく

  // checkRomaji('k', getInputCombinations([stringToUnicode('か')]))
  // checkRomaji('ka', getInputCombinations([stringToUnicode('か')]))
  // checkRomaji('n', getInputCombinations([stringToUnicode('ん')]))
  // checkRomaji('n', getInputCombinations([stringToUnicode('に')]))
  // checkRomaji('ni', getInputCombinations([stringToUnicode('に')]))
  // checkRomaji('n', getInputCombinations([stringToUnicode('ね')]))
  // checkRomaji('ne', getInputCombinations([stringToUnicode('ね')]))
  // checkRomaji('t', getInputCombinations([stringToUnicode('つ')]))
  // checkRomaji('ts', getInputCombinations([stringToUnicode('つ')]))
  // checkRomaji('tsu', getInputCombinations([stringToUnicode('つ')]))
  // checkRomaji('j', getInputCombinations([stringToUnicode('じ')]))
  // checkRomaji('ji', getInputCombinations([stringToUnicode('じ')]))
  // checkRomaji('k', getInputCombinations([stringToUnicode('か')]))
  // checkRomaji('e', getInputCombinations([stringToUnicode('か')]))
  // checkRomaji('r', getInputCombinations([stringToUnicode('り')]))
  // checkRomaji('rn', getInputCombinations([stringToUnicode('り')]))
  // checkRomaji('rno', getInputCombinations([stringToUnicode('り')]))
  // checkRomaji('q', getInputCombinations([stringToUnicode('て')]))
  // checkRomaji('qv', getInputCombinations([stringToUnicode('て')]))
  // checkRomaji('qvo', getInputCombinations([stringToUnicode('て')]))
  // checkRomaji('qvow', getInputCombinations([stringToUnicode('て')]))
  // checkRomaji('qvowa', getInputCombinations([stringToUnicode('て')]))
  // checkRomaji('qvowad', getInputCombinations([stringToUnicode('て')]))
  // checkRomaji('qvowadi', getInputCombinations([stringToUnicode('て')]))
  // checkRomaji('qvowadis', getInputCombinations([stringToUnicode('て')]))
  // checkRomaji('qvowadiso', getInputCombinations([stringToUnicode('て')]))
  // checkRomaji('qvowadisor', getInputCombinations([stringToUnicode('て')]))
  // checkRomaji('qvowadisort', getInputCombinations([stringToUnicode('て')]))

  // checkRomaji('ka', getInputCombinations(['3061', '3083']))
  // checkRomaji('ka', getInputCombinations(['306b', '3083']))
  // checkRomaji('ka', getInputCombinations(['3063', '3066']))
  // checkRomaji('ka', getInputCombinations(['3063', '3061']))
  // checkRomaji('ka', getInputCombinations(['3063', '3061', '3083']))
  // checkRomaji('ka', getInputCombinations(['3063', '306b', '3083']))
// }, [])