import { useEffect, useReducer } from 'react'

function useOnHtmlRendered(initialElt, targetSelector, callback, dependencies = []) {
  // TODO: cannot use it, see message below. Implement it at some point
  /** 
   * code: 
   * `const getMoraeLetterSpacing = useOnHtmlRendered(document.body, '.morae__symbol', getLetterSpacing, [isLoading])` 
   * 
   * vs default code:
   * `const getMoraeLetterSpacing = getLetterSpacing(document.querySelector('.morae__symbol') || document.body)`.
   * 
   * Cannot use the replacer with hook because it does not properly update the value even with dependencies given. The value does not "update" or is not used after we make sure that the element IS in the node tree. Also throws an error about dependency array in useEffect changing sizes between re-renders?
   */
  const reducer = state => {
    const newElt = document.querySelector(targetSelector)

    if (newElt !== null && initialElt?.isEqualNode && !initialElt.isEqualNode(newElt))
      return callback(newElt)

    return state
  }

  const [value, dispatch] = useReducer(reducer, initialElt, elt => callback(elt))

  useEffect(() => {
    console.log(document.querySelector(targetSelector))
    dispatch()
  }, dependencies)

  return value
}

export default useOnHtmlRendered