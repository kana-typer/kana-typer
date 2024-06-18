import { expect, test, beforeAll, describe, beforeEach } from 'vitest'
import * as func from '../kana'
import kanaUnicodes from '../../data/unicode-map.json'
import data from './data.json'


const hiraganaMap = data.hiraganaMap
let hiraganaMap2 = {}


beforeAll(() => {
  hiraganaMap2.standard = new Map(Object.entries(data.hiraganaMap))
  hiraganaMap2.sokuon = new Map(
    Object
      .entries(data.hiraganaMap)
      .filter(([_, romaji]) => romaji.length > 1 && !romaji.startsWith('x'))
      .map(([code, romaji]) => ([['3063', code], `${romaji.startsWith('c') ? 't' : romaji.charAt(0)}${romaji}`]))
  )
  hiraganaMap2.yoon = new Map(
    Object
      .entries(data.hiraganaMap)
      .filter(([_, romaji]) => romaji.length > 1 && romaji.endsWith('i'))
      .reduce((acc, [code, romaji]) => {
        let romajiBeginning = romaji.slice(0, -1)
        let endings = ['a', 'u', 'o']
        let codes = ['3083', '3085', '3087']
        let special = ['shi', 'chi', 'ji'].includes(romaji) ? '' : 'y'

        for (let i = 0; i < endings.length; i++)
          acc.push([[code, codes[i]], romajiBeginning + special + endings[i]])

        return acc
      }, [])
  )
  hiraganaMap2.soukonYoon = new Map([...hiraganaMap2.yoon].reduce((acc, [codes, romaji]) => (
    [...acc, [['3063', ...codes], `${romaji.startsWith('c') ? 't' : romaji.charAt(0)}${romaji}`]]
  ), []))
})

describe('Parsing from DB', () => {
  test('parseUnicodeMap returning proper object', () => {
    const map = func.parseUnicodeMap(data.unicodeMap)
    expect(map).toEqual(data.hiraganaMap)
  })
})

describe('Helper functions', () => {
  // TODO: functions run with internal hiraganaMap, which cannot be tested

  test('unicodeToKana, given hex string, returns kana symbol', () => {
    expect(func.unicodeToKana('304b')).toBe('か')
  })

  test('unicodeToRomaji, given hex string, returns romaji string', () => {
    expect(func.unicodeToRomaji('304b')).toBe('ka')
  })

  test('kanaToUnicode, given kana symbol, returns hex string', () => {
    expect(func.kanaToUnicode('か')).toBe('304b')
  })

  test('kanaToRomaji, given kana symbol, returns romaji string', () => {
    expect(func.kanaToRomaji('か')).toBe('ka')
  })
})

describe('Core functions', () => {
  let bigHiraganaMap

  beforeAll(() => {
    bigHiraganaMap = new Map([
      ...hiraganaMap2.standard, 
      ...hiraganaMap2.sokuon, 
      ...hiraganaMap2.yoon, 
      ...hiraganaMap2.soukonYoon
    ])
  })

  test('getInputCombinations returns valid combinations', () => {
    const _ = (c) => func.kanaToUnicode(c) 
    const moraeMap = new Map([
      ...Object.entries(hiraganaMap).reduce((acc, [key, val]) => ([...acc, [[key], [val]]]), []),
      [[_('し'), _('ゃ')], ['shixya', 'sha']],
      [[_('ぎ'), _('ゅ')], ['gixyu', 'gyu']],
      [[_('に'), _('ょ')], ['nixyo', 'nyo']],
      [[_('ち'), _('ゃ')], ['chixya', 'cha']],
      [[_('っ'), _('て')], ['xtsute', 'tte']],
      [[_('っ'), _('ぴ'), _('ょ')], ['xtsupixyo', 'ppyo', 'ppixyo', 'xtsupyo']],
      [[_('っ'), _('ち'), _('ゅ')], ['xtsuchixyu', 'tchu', 'tchixyu', 'xtsuchu']],
    ])

    for (const [unicodeArray, validArray] of moraeMap) {
      let combinations = func.getInputCombinations(unicodeArray)
      expect(combinations).toEqual(validArray)
    }
  })

  test('checkRomaji returns true when romaji is correct', () => {
    for (const [codes, romaji] of bigHiraganaMap) {
      const combinations = func.getInputCombinations(Array.isArray(codes) ? codes : [codes])
      const result = func.checkRomaji(romaji, combinations)
      expect(result).toBe(true)
    }
  })

  test('checkRomaji returns false when romaji is incorrect', () => {
    expect(func.checkRomaji('ru', ['te'])).toBe(false)
  })

  test('checkRomaji returns false when romaji is too long', () => {
    expect(func.checkRomaji('kkkkkkkkkkk', ['ka'])).toBe(false)
  })

  test('checkRomaji returns undefined when romaji is not a finished mora', () => {
    expect(func.checkRomaji('n', ['ni'])).toBe(undefined)
    expect(func.checkRomaji('k', ['ka'])).toBe(undefined)
    expect(func.checkRomaji('k', ['re'])).toBe(undefined)
  })
})
