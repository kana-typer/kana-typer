import { describe, expect, it } from 'vitest'
import * as func from '../objects'


describe('getUniqueData()', () => {
  it('should return array of objects not included in old array', () => {
    const newData = [{ test: 1 }, { test: 2 }, { test: 3 }]
    const oldData = [{ test: 1 }, { test: 2 }]
    const key = 'test'

    const result = func.getUniqueData(newData, oldData, key)
    expect(result).toEqual([{ test: 3  }])
  })
})

describe('getMapOfOccurences()', () => {
  it('should return 3 `1`s and 2 `2`s for given array [1, 1, 1, 2, 2]', () => {
    const values = [1, 1, 1, 2, 2]

    const result = func.getMapOfOccurences(values)
    expect(result.get(1)).toEqual(3)
    expect(result.get(2)).toEqual(2)
  })
})
