import { beforeEach, describe, expect, it } from 'vitest'
import * as func from '../text'

let elt

describe('getStyle()', () => {
  beforeEach(() => {
    elt = document.createElement('h1')
  })

  it('should return `font-weight` property of `h1` as `bold`', () => {
    const value = func.getStyle(elt, 'font-weight')
    expect(value).toBe('bold')
  })

  it('should return empty string for unset property', () => {
    const value = func.getStyle(elt, 'font-style')
    expect(value).toBe('')
  })

  it('should return empty string for invalid property', () => {
    const value = func.getStyle(elt, 'non-existent-css-property')
    expect(value).toBe('')
  })
})

describe('getTextFont()', () => {
  beforeEach(() => {
    elt = document.createElement('p')
  })

  it('should return font data as string', () => {
    elt.style.fontWeight = 'bold'
    elt.style.fontSize = '2rem'
    elt.style.fontFamily = 'Arial'

    const font = func.getTextFont(elt)
    expect(font).toBe('bold 2rem Arial')
  })

  it('should return default values in string in place of missing ones', () => {
    const font = func.getTextFont(elt)
    expect(font).toBe('normal 16px Times New Roman')
  })
})
