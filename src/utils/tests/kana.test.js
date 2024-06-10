import { expect, test } from 'vitest'
import { unicodeToString } from '../kana'


test('0x304b === ka', () => {
  expect(unicodeToString('304b')).toBe('か')
})
