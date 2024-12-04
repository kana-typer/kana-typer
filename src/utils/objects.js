/**
 * Filters old data based off of identifiably unique values of given key, to check for duplicates and return only new objects based off of that identifiable unique value of specified key.
 * Will take a long time depending on the size of the data. In worse case scenario O(n^2).
 * @param {object[]} newData - new data with possible duplicates
 * @param {object[]} oldData - old data to check against for duplicates
 * @param {string} key - object's property in both data sets to check against its value
 * @returns {object[]} filtered new data array that contains either only unique objects or is an empty array.
 */
export const getUniqueData = (newData, oldData, key) => (
  newData.filter(newObj => !oldData.some(oldObj => oldObj?.[key] === newObj?.[key]))
)

/**
 * 
 * @param {any[]} values 
 */
export const getMapOfOccurences = (values) => {
  if (!Array.isArray(values))
    return new Map()

  const addToMapOfOccurences = (map, x) => {
    map.set(x, (map.get(x) || 0 ) + 1)
    return map
  }

  return values.reduce(addToMapOfOccurences, new Map())
}