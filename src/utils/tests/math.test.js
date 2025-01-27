import { describe, expect, it } from 'vitest'
import * as func from '../math'


describe('getPercFromValue()', () => {
  it('should return 50% (as 50) from value=12 and maxValue=24', () => {
    const result = func.getPercFromValue(12, 24)
    expect(result).toBe(50)
  })
})
