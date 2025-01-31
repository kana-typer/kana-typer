import { describe, expect, it } from 'vitest'
import * as func from '../types'


describe('isNullOrUndefined()', () => {
  it('should return true for null given', () => {
    const result = func.isNullOrUndefined(null)
    expect(result).toBe(true)
  })

  it('should return true for undefined given', () => {
    const result = func.isNullOrUndefined(undefined)
    expect(result).toBe(true)
  })

  it('should return false for string given', () => {
    const result = func.isNullOrUndefined('text')
    expect(result).toBe(false)
  })
})
