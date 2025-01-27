import { describe, expect, it } from 'vitest'
import * as func from '../rand'


describe('createSeededLCGRand()', () => {
  it('should return same random value for same seed given', () => {
    const resultFunc = func.createSeededLCGRand(12345)
    const result = resultFunc()
    expect(result).toBe(0.02040268573909998)
  })
})
