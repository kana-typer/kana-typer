/**
 * Returns a percentage in range [0, 100] of given value.
 * Given value must be in range [0, maxValue].
 * @param {number} value - value to return a percentage of
 * @param {number} maxValue - top range of the value
 */
export const getPercFromValue = (value, maxValue) => value * 100 / maxValue
