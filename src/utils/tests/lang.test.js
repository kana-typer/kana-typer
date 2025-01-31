import { describe, expect, it } from 'vitest'
import * as func from '../lang'


describe('getCurrentLanguageCode()', () => {
  it('should return `en` as english is the default selected language', () => {
    const result = func.getCurrentLanguageCode()
    expect(result).toBe('en')
  })
})
