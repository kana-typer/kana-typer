import { expect, test } from 'vitest'
import { unicodeToString } from '../kana'


test('0x304b === ka', () => {
  expect(unicodeToString('304b')).toBe('か')
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