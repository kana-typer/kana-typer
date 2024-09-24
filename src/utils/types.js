export const objectsEqual = (obj1, obj2, recursiveDepth = Number.MAX_SAFE_INTEGER) => {
  const keys1 = Object.keys(obj1).sort()
  const keys2 = Object.keys(obj2).sort()

  if (keys1.length !== keys2.length)
    return false

  for (let i = 0; i < keys1.length; i++)
    if (keys1[i] !== keys2[i])
      return false

  for (const key of keys1) {
    const val1 = obj1[key]
    const val2 = obj2[key]

    const areSubObjects = val1 && typeof val1 === 'object' && val2 && typeof val2 === 'object'

    if (areSubObjects && !objectsEqual(val1, val2, recursiveDepth - 1))
      return false

    if (!areSubObjects && val1 !== val2)
      return false
  }

  return true
}