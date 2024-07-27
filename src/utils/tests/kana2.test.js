import { describe, it, beforeAll, expect, toBe } from 'vitest'
import { basename } from 'path'

let data
let kanaMap


beforeAll(async () => {
  const prop = 'kana' || basename(__filename.split('.')[0])
  data = (await import('./data2.json'))[prop]
})

describe('parseUnicodeMap', () => {
  it('t', () => {
    expect(true).toBe(true)
  })
})