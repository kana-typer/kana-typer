const canvas = document.createElement('canvas')


/**
 * Get computed style of name `prop` in given element.
 * @param {HTMLElement} elt 
 * @param {string} prop 
 * @param {string | null} pseudoElt 
 * @returns string
 */
export const getStyle = (elt, prop, pseudoElt = null) => (
  window.getComputedStyle(elt, pseudoElt).getPropertyValue(prop)
)

/**
 * Get computed text style of given element.
 * @param {HTMLElement} elt 
 * @returns string
 */
export const getTextFont = (elt) => {
  const font = {
    weight: getStyle(elt, 'font-weight') || 'normal',
    size: getStyle(elt, 'font-size') || '16px',
    family: getStyle(elt, 'font-family') || 'Times New Roman',
  }

  return `${font.weight} ${font.size} ${font.family}`
}

/**
 * Get width a text would take inside element.
 * @param {string} text 
 * @param {HTMLelement} elt 
 */
export const getTextWidth = (text, elt = document.body) => {
  const context = canvas.getContext('2d')
  context.font = getTextFont(parent)
  return context.measureText(text).width
}