import { createContext, useContext, useState } from 'react'

import { generateFilteredMoraMap, generateFullMoraMap, generateSmallModifiers } from '../utils/kana'
import { objectsEqual } from '../utils/types'

const TyperDataContext = createContext()

export const useTyperData = () => useContext(TyperDataContext)

export default function TyperDataProvider({ children }) {
  const [mora, setMora] = useState({ 
    all: null, 
    filtered: null, 
    modifiers: null,
    includeFilters: {},
    excludeFilters: {},
  })

  /**
   * Updates mora state based on previous state and given values. \
   * All calculations for state-change are put into this singular function so that it ensures only one re-render happens when state of mora needs to change.
   * - If `mora.all` is not null, no new data will be downloaded from DB.
   * - If `mora.modifiers` is not null, no new small, modifiable kana will be generated.
   * - If given filters are equal to old ones, they will not override current ones. 
   * - If at least one of statements above results in calculations, `mora.filtered` will also be re-calculated.
   * Otherwise, if all statements are skipped, state update will also be skipped
   * @param {*} includeFiltersObj - specifies include filtering for mora
   * @param {*} excludeFiltersObj - specified exclude filtering for mora
   */
  const updateMora = async (includeFiltersObj = {}, excludeFiltersObj = {}) => {
    // if this object is empty it means DO NOT update mora state
    let newMora = {}

    if (mora.all === null) {
      console.debug('TyperDataContext.updateMora: updating mora.all')
      const sample = await import('../data/db-sample.json') // TODO: implement fetch from actual DB
      newMora.all = generateFullMoraMap(sample.mora)
    }
  
    if (mora.modifiers === null) {
      console.debug('TyperDataContext.updateMora: updating mora.modifiers')
      newMora.modifiers = generateSmallModifiers(mora.all ?? newMora.all)
    }

    if (!objectsEqual(mora.includeFilters, includeFiltersObj)) {
      console.debug('TyperDataContext.updateMora: updating mora.includeFilters')
      newMora.includeFilters = includeFiltersObj
    }

    if (!objectsEqual(mora.excludeFilters, excludeFiltersObj)) {
      console.debug('TyperDataContext.updateMora: updating mora.excludeFilters')
      newMora.excludeFilters = excludeFiltersObj
    }

    if (!objectsEqual(newMora, {})) {
      console.debug('TyperDataContext.updateMora: running setState')
      setMora(prev => ({
        ...prev,
        ...newMora,
        filtered: generateFilteredMoraMap(
          mora.all ?? newMora.all, 
          mora.modifiers ?? newMora.modifiers, 
          newMora.includeFilters,
          newMora.excludeFilters,
        )
      }))
    } else {
      console.debug('TyperDataContext.updateMora: state does not have to change')
    }
  }

  const value = {
    mora,
    updateMora,
  }

  return (
    <TyperDataContext.Provider value={value}>
      {children}
    </TyperDataContext.Provider>
  )
}