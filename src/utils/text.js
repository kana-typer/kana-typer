const canvas = document.createElement('canvas')


/**
 * Get computed style of name `prop` in given element.
 * @param {HTMLElement} elt 
 * @param {string} prop 
 * @param {string | null} pseudoElt 
 * @returns string
 */
export const getStyle = (elt, prop, pseudoElt = null) => window.getComputedStyle(elt, pseudoElt).getPropertyValue(prop)

/**
 * Get computed text style of given element.
 * @param {HTMLElement} elt 
 * @returns string
 */
export function getTextFont(elt) {
  const font = {
    weight: getStyle(elt, 'font-weight') || 'normal',
    size: getStyle(elt, 'font-size') || '16px',
    family: getStyle(elt, 'font-family') || 'Times New Roman',
  }

  return `${font.weight} ${font.size} ${font.family}`
}

/**
 * Get size of letter spacing of given element.
 * @param {HTMLElement} elt 
 * @returns {number} 0 for `letter-spacing: normal`, number otherwise.
 */
export function getLetterSpacing(elt) {
  const valueString = getStyle(elt, 'letter-spacing') || '0px'
  const value = valueString === 'normal' ? 0 : parseFloat(valueString)
  return value
}

/**
 * Get width a text would take inside element.
 * @param {string} text 
 * @param {HTMLelement} parent 
 */
export function getTextWidth(text, parent = document.body, letterSpacing) {
  const context = canvas.getContext('2d')
  context.font = getTextFont(parent)

  const totalLetterSpacing = text.length * letterSpacing
  const width = context.measureText(text).width
  
  return width + totalLetterSpacing
}
