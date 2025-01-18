import { beforeEach, beforeAll, describe, expect, it } from 'vitest'
import * as func from '../kana'


describe('generateModifiers', () => {
  let mora = null

  beforeAll(() => {
    mora = [
      {
        symbol: 'や',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'ya' },
        extended: false,
        small: 'ゃ',
        sokuon: 'y',
        yoon: null,
      },
      { 
        symbol: 'ゆ',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'yu' },
        extended: false,
        small: 'ゅ',
        sokuon: 'y',
        yoon: null,
      },
      { 
        symbol: 'よ',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'yo' },
        extended: false,
        small: 'ょ',
        sokuon: 'y',
        yoon: null,
      },
      {
        symbol: 'ヤ',
        script: 'katakana',
        type: 'gojuon',
        furigana: { hiragana: 'や', romaji: 'ya' },
        extended: false,
        small: 'ャ',
        sokuon: 'y',
        yoon: null,
      },
      { 
        symbol: 'ユ',
        script: 'katakana',
        type: 'gojuon',
        furigana: { hiragana: 'ゆ', romaji: 'yu' },
        extended: false,
        small: 'ュ',
        sokuon: 'y',
        yoon: null,
      },
      { 
        symbol: 'ヨ',
        script: 'katakana',
        type: 'gojuon',
        furigana: { hiragana: 'よ', romaji: 'yo' },
        extended: false,
        small: 'ョ',
        sokuon: 'y',
        yoon: null,
      },
      { 
        symbol: 'つ',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'tsu' },
        extended: false,
        small: 'っ',
        sokuon: 't',
        yoon: null,
      },
      { 
        symbol: 'ツ',
        script: 'katakana',
        type: 'gojuon',
        furigana: { hiragana: 'つ', romaji: 'tsu' },
        extended: false,
        small: 'ッ',
        sokuon: 't',
        yoon: null,
      },
    ]
  })

  it('should create full modifier object being given every kana needed and having no previous modifiers', () => {
    const prevModifiers = {
      sokuon: { hiragana: null, katakana: null },
      yoon: {
        hiragana: { ya: null, yu: null, yo: null },
        katakana: { ya: null, yu: null, yo: null },
      },
    }

    const value = func.generateModifiers(mora, prevModifiers)

    expect(value).toEqual({
      sokuon: { hiragana: 'っ', katakana: 'ッ' },
      yoon: {
        hiragana: { ya: 'ゃ', yu: 'ゅ', yo: 'ょ' },
        katakana: { ya: 'ャ', yu: 'ュ', yo: 'ョ' },
      },
    })
  })

  it('should create full modifier object being given only hiragana and having katakana as previous modifiers', () => {
    const prevModifiers = {
      sokuon: { hiragana: null, katakana: 'ッ' },
      yoon: {
        hiragana: { ya: null, yu: null, yo: null },
        katakana: { ya: 'ャ', yu: 'ュ', yo: 'ョ' },
      },
    }

    const hiragana = mora.filter(obj => obj.script === 'hiragana')
    const value = func.generateModifiers(hiragana, prevModifiers)

    expect(value).toEqual({
      sokuon: { hiragana: 'っ', katakana: 'ッ' },
      yoon: {
        hiragana: { ya: 'ゃ', yu: 'ゅ', yo: 'ょ' },
        katakana: { ya: 'ャ', yu: 'ュ', yo: 'ョ' },
      },
    })
  })

  it('should create no modifiers being given empty array and having no previous modifiers', () => {
    const prevModifiers = {
      sokuon: { hiragana: null, katakana: null },
      yoon: {
        hiragana: { ya: null, yu: null, yo: null },
        katakana: { ya: null, yu: null, yo: null },
      },
    }

    const value = func.generateModifiers([], prevModifiers)

    expect(value).toEqual(prevModifiers)
  })
})

describe('pickFurigana()', () => {
  it('should pick romaji for existing furigana.romaji with progress=0', () => {
    const furigana = { hiragana: null, romaji: 'ka' }
    const progress = 0

    const value = func.pickFurigana(furigana, progress)
    
    expect(value).toBe('ka')
  })

  it('should return empty string for non-existing furigana.romaji with progress=2', () => {
    const furigana = { hiragana: null, romaji: null }
    const progress = 0

    const value = func.pickFurigana(furigana, progress)
    
    expect(value).toBe('')
  })

  it('should return hiragana for existing furigana.hiragana with progress=6', () => {
    const furigana = { hiragana: 'か', romaji: 'ka' }
    const progress = 6

    const value = func.pickFurigana(furigana, progress)
    
    expect(value).toBe('か')
  })

  it('should return empty string for existing furigana, but progress=12', () => {
    const furigana = { hiragana: 'か', romaji: 'ka' }
    const progress = 12

    const value = func.pickFurigana(furigana, progress)
    
    expect(value).toBe('')
  })

  it('should return empty string for furigana=null', () => {
    const furigana = null
    const progress = 6

    const value = func.pickFurigana(furigana, progress)
    
    expect(value).toBe('')
  })

  it('should return romaji for existing furigana with progress=-100', () => {
    const furigana = { hiragana: 'か', romaji: 'ka' }
    const progress = -100

    const value = func.pickFurigana(furigana, progress)
    
    expect(value).toBe('ka')
  })
})

describe('generateMoraMap()', () => {
  let source = []
  let modifiers = {}

  beforeAll(() => {
    source = [
      {
        symbol: 'か',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'ka' },
        extended: false,
        small: null,
        sokuon: 'k',
        yoon: null,
      },
      {
        symbol: 'き',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'ki' },
        extended: false,
        small: null,
        sokuon: 'k',
        yoon: 'y',
      },
      {
        symbol: 'く',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'ku' },
        extended: false,
        small: null,
        sokuon: 'k',
        yoon: null,
      },
      {
        symbol: 'け',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'ke' },
        extended: false,
        small: null,
        sokuon: 'k',
        yoon: null,
      },
      {
        symbol: 'こ',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'ko' },
        extended: false,
        small: null,
        sokuon: 'k',
        yoon: null,
      },
      {
        symbol: 'し',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'shi' },
        extended: false,
        small: null,
        sokuon: 's',
        yoon: '',
      },
      {
        symbol: 'バ',
        script: 'katakana',
        type: 'dakuten',
        furigana: { hiragana: 'ば', romaji: 'ba' },
        extended: false,
        small: null,
        sokuon: 'b',
        yoon: null,
      },
      {
        symbol: 'ビ',
        script: 'katakana',
        type: 'dakuten',
        furigana: { hiragana: 'び', romaji: 'bi' },
        extended: false,
        small: null,
        sokuon: 'b',
        yoon: 'y',
      },
      {
        symbol: 'ブ',
        script: 'katakana',
        type: 'dakuten',
        furigana: { hiragana: 'ぶ', romaji: 'bu' },
        extended: false,
        small: null,
        sokuon: 'b',
        yoon: null,
      },
      {
        symbol: 'ベ',
        script: 'katakana',
        type: 'dakuten',
        furigana: { hiragana: 'べ', romaji: 'be' },
        extended: false,
        small: null,
        sokuon: 'b',
        yoon: null,
      },
      {
        symbol: 'ポ',
        script: 'katakana',
        type: 'handakuten',
        furigana: { hiragana: 'ぽ', romaji: 'po' },
        extended: false,
        small: null,
        sokuon: 'p',
        yoon: null,
      },
      {
        symbol: 'ドゥ',
        script: 'katakana',
        type: 'dakuten',
        furigana: { hiragana: 'どぅ', romaji: 'du' },
        extended: true,
        small: null,
        sokuon: 'd',
        yoon: null,
      },
      {
        symbol: 'や',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'ya' },
        extended: false,
        small: 'ゃ',
        sokuon: 'y',
        yoon: null,
      },
      { 
        symbol: 'ゆ',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'yu' },
        extended: false,
        small: 'ゅ',
        sokuon: 'y',
        yoon: null,
      },
      { 
        symbol: 'よ',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'yo' },
        extended: false,
        small: 'ょ',
        sokuon: 'y',
        yoon: null,
      },
      {
        symbol: 'ヤ',
        script: 'katakana',
        type: 'gojuon',
        furigana: { hiragana: 'や', romaji: 'ya' },
        extended: false,
        small: 'ャ',
        sokuon: 'y',
        yoon: null,
      },
      { 
        symbol: 'ユ',
        script: 'katakana',
        type: 'gojuon',
        furigana: { hiragana: 'ゆ', romaji: 'yu' },
        extended: false,
        small: 'ュ',
        sokuon: 'y',
        yoon: null,
      },
      { 
        symbol: 'ヨ',
        script: 'katakana',
        type: 'gojuon',
        furigana: { hiragana: 'よ', romaji: 'yo' },
        extended: false,
        small: 'ョ',
        sokuon: 'y',
        yoon: null,
      },
      { 
        symbol: 'つ',
        script: 'hiragana',
        type: 'gojuon',
        furigana: { hiragana: null, romaji: 'tsu' },
        extended: false,
        small: 'っ',
        sokuon: 't',
        yoon: null,
      },
      { 
        symbol: 'ツ',
        script: 'katakana',
        type: 'gojuon',
        furigana: { hiragana: 'つ', romaji: 'tsu' },
        extended: false,
        small: 'ッ',
        sokuon: 't',
        yoon: null,
      },
    ]
    modifiers = {
      sokuon: { hiragana: 'っ', katakana: 'ッ' },
      yoon: {
        hiragana: { ya: 'ゃ', yu: 'ゅ', yo: 'ょ' },
        katakana: { ya: 'ャ', yu: 'ュ', yo: 'ョ' },
      },
    }
  })

  it('should return all kana with extended katakana, kana modified into yoons and sokuons as well', () => {
    const progress = {}
    const filters = {
      scripts: ['hiragana', 'katakana'],
      types: ['gojuon', 'dakuten', 'handakuten'],
      extended: true,
      sokuon: true,
      yoon: true,
    }

    const value = func.generateMoraMap(source, modifiers, progress, filters)

    expect(value).toHaveLength(50)

    expect(value.has('ka')).toBe(true)
    expect(value.get('ka').length).toBe(1)

    expect(value.has('sha')).toBe(true)
    expect(value.get('sha').length).toBe(1)

    expect(value.has('ya')).toBe(true)
    expect(value.get('ya').length).toBe(2)
  })

  it('should return only hiragana with yoons and sokuons', () => {
    const progress = {}
    const filters = {
      scripts: ['hiragana'],
      types: ['gojuon'],
      extended: false,
      sokuon: true,
      yoon: true,
    }

    const value = func.generateMoraMap(source, modifiers, progress, filters)
    
    expect(value).toHaveLength(32)

    expect(value.has('ka')).toBe(true)
    expect(value.get('ka').length).toBe(1)

    expect(value.has('sha')).toBe(true)
    expect(value.get('sha').length).toBe(1)

    expect(value.has('ya')).toBe(true)
    expect(value.get('ya').length).toBe(1)

    expect(value.has('du')).toBe(false)
  })
})

describe('generateWordsMap()', () => {
  let source = []

  beforeAll(() => {
    source = [
      {
        kana: 'ハムスター',
        category: 'animals',
        type: 'noun',
        furigana: { hiragana: 'はむすたー', romaji: 'hamusutaa', reading: null },
        translation: { en: 'hamster', pl: 'chomik' },
      }, 
      {
        kana: '猫',
        category: 'animals',
        type: 'noun',
        furigana: { hiragana: 'ねこ', romaji: 'neko', reading: null },
        translation: { en: 'cat', pl: 'kot' },
      }, 
      {
        kana: '六',
        category: 'numbers',
        type: 'numeral',
        furigana: { hiragana: 'ろく', romaji: 'roku', reading: null },
        translation: { en: 'six', pl: 'sześć' },
      },
      {
        kana: '私',
        category: 'people',
        type: 'pronoun',
        furigana: { hiragana: 'わたし', romaji: 'watashi', reading: null },
        translation: { en: 'I', pl: 'ja' },
      },
    ]
  })

  it('should return all available words', () => {
    const progress = {}
    const filters = {
      categories: ['animals', 'numbers', 'people'],
      types: ['noun', 'numeral', 'pronoun']
    }

    const value = func.generateWordsMap(source, progress, filters)
    
    expect(value).toHaveLength(4)
    expect([...value.keys()]).toEqual(['hamusutaa', 'neko', 'roku', 'watashi'])
  })

  it('should return only pronouns', () => {
    const progress = {}
    const filters = {
      categories: ['animals', 'numbers', 'people'],
      types: ['pronoun']
    }

    const value = func.generateWordsMap(source, progress, filters)
    
    expect(value).toHaveLength(1)
    expect([...value.keys()]).toEqual(['watashi'])
  })

  it('should return nouns animals and numeral numbers', () => {
    const progress = {}
    const filters = {
      categories: ['animals', 'numbers'],
      types: ['noun', 'numeral']
    }

    const value = func.generateWordsMap(source, progress, filters)
    
    expect(value).toHaveLength(3)
    expect([...value.keys()]).toEqual(['hamusutaa', 'neko', 'roku'])
  })

  it('should return nothing, because no categories or types were specified', () => {
    const progress = {}
    const filters = {
      categories: [],
      types: []
    }

    const value = func.generateWordsMap(source, progress, filters)
    
    expect(value).toHaveLength(0)
    expect([...value.keys()]).toEqual([])
  })
})

describe('getRandomKanaFromMap()', () => {
  it('should return random kana objects in a list with seed=123', () => {
    const sourceMap = new Map([
      ['a', { kana: 'あ' }], 
      ['i', { kana: 'い' }], 
      ['u', { kana: 'う' }], 
      ['e', { kana: 'え' }], 
      ['o', { kana: 'お' }], 
      ['ka', { kana: 'か' }], 
      ['ki', { kana: 'き' }], 
      ['ku', { kana: 'く' }], 
      ['ke', { kana: 'け' }], 
      ['ko', { kana: 'こ' }], 
      ['tta', { kana: 'った' }],
      ['tchi', { kana: 'っち' }],
      ['ttsu', { kana: 'っつ' }],
      ['tte', { kana: 'って' }],
      ['tto', { kana: 'っと' }],
      ['ha', { kana: 'ヒ' }],
      ['hi', { kana: 'ハ' }],
      ['hu', { kana: 'フ' }],
      ['he', { kana: 'ヘ' }],
      ['ho', { kana: 'ホ' }],
      ['pya', { kana: 'ピャ' }],
      ['pyu', { kana: 'ピュ' }],
      ['pyo', { kana: 'ピョ' }],
    ])

    const value = func.getRandomKanaFromMap(10, sourceMap, { seed: 123 })

    expect(value).toEqual([
      { kana: 'き' },
      { kana: 'った' },
      { kana: 'あ' },
      { kana: 'か' },
      { kana: 'け' },
      { kana: 'って' },
      { kana: 'け' },
      { kana: 'く' },
    ])
  })

  it('should return a different array of objects for same sourceMap, but different seed', () => {
    const sourceMap = new Map([
      ['a', { kana: 'あ' }], 
      ['i', { kana: 'い' }], 
      ['u', { kana: 'う' }], 
      ['e', { kana: 'え' }], 
      ['o', { kana: 'お' }], 
      ['ka', { kana: 'か' }], 
      ['ki', { kana: 'き' }], 
      ['ku', { kana: 'く' }], 
      ['ke', { kana: 'け' }], 
      ['ko', { kana: 'こ' }], 
      ['tta', { kana: 'った' }],
      ['tchi', { kana: 'っち' }],
      ['ttsu', { kana: 'っつ' }],
      ['tte', { kana: 'って' }],
      ['tto', { kana: 'っと' }],
      ['ha', { kana: 'ヒ' }],
      ['hi', { kana: 'ハ' }],
      ['hu', { kana: 'フ' }],
      ['he', { kana: 'ヘ' }],
      ['ho', { kana: 'ホ' }],
      ['pya', { kana: 'ピャ' }],
      ['pyu', { kana: 'ピュ' }],
      ['pyo', { kana: 'ピョ' }],
    ])

    const value = func.getRandomKanaFromMap(10, sourceMap, { seed: 321 })

    expect(value).not.toEqual([
      { kana: 'き' },
      { kana: 'った' },
      { kana: 'あ' },
      { kana: 'か' },
      { kana: 'け' },
      { kana: 'って' },
      { kana: 'け' },
      { kana: 'く' },
    ])
  })

  it('should return an empty array if sourceMap is empty', () => {
    const sourceMap = new Map([])

    const value = func.getRandomKanaFromMap(10, sourceMap, { seed: 123 })
    
    expect(value).toEqual([])
  })

  it('should return 10 `あ` kana objects with only `a` in sourceMap and amount=10', () => {
    const sourceMap = new Map([['a', { kana: 'あ' }]])

    const value = func.getRandomKanaFromMap(10, sourceMap, { seed: 123 })

    expect(value).toEqual([
      { kana: 'あ' },
      { kana: 'あ' },
      { kana: 'あ' },
      { kana: 'あ' },
      { kana: 'あ' },
      { kana: 'あ' },
      { kana: 'あ' },
      { kana: 'あ' },
      { kana: 'あ' },
      { kana: 'あ' },
    ])
  })
})

describe('checkRomajiValidityOfKana()', () => {
  let sourceMap = null

  beforeAll(() => {
    sourceMap = new Map([
      ['a', [{ kana: 'あ', script: 'hiragana' }, { kana: 'ア', script: 'katakana' }]], 
      ['i', [{ kana: 'イ', script: 'katakana' }]], 
      ['u', [{ kana: 'う', script: 'hiragana' }]], 
      ['e', [{ kana: 'え', script: 'hiragana' }]], 
      ['o', [{ kana: 'お', script: 'hiragana' }]], 
      ['ka', [{ kana: 'か', script: 'hiragana' }, { kana: 'カ', script: 'katakana' }]], 
      ['ki', [{ kana: 'キ', script: 'katakana' }]], 
      ['ku', [{ kana: 'く', script: 'hiragana' }]], 
      ['ke', [{ kana: 'け', script: 'hiragana' }]], 
      ['ko', [{ kana: 'こ', script: 'hiragana' }]], 
    ])
  })

  it('should return true for given `a` against `あ` and sourceMap.get(a).includes(あ)=true', () => {
    const value = func.checkRomajiValidityOfKana('a', 'あ', sourceMap)
    expect(value).toBe(true)
  })

  it('should return true for given `a` against `カ` and sourceMap.get(a).includes(カ)=true', () => {
    const value = func.checkRomajiValidityOfKana('ka', 'カ', sourceMap)
    expect(value).toBe(true)
  })

  it('should return true for given `u` against `う` and sourceMap.get(u).includes(う)=true', () => {
    const value = func.checkRomajiValidityOfKana('u', 'う', sourceMap)
    expect(value).toBe(true)
  })

  it('should return false for given `ke` against `ko`', () => {
    const value = func.checkRomajiValidityOfKana('ke', 'こ', sourceMap)
    expect(value).toBe(false)
  })

  it('should return undefined for given `k` against `ka`', () => {
    const value = func.checkRomajiValidityOfKana('k', 'か', sourceMap)
    expect(value).toBe(undefined)
  })
})
