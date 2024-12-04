import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as func from '../globals'


describe('isTest()', () => {
  it('should return true, as it is a test environment', () => {
    const result = func.isTest()
    expect(result).toBe(true)
  })
})
