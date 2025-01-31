import { auth, db } from '../config/firebase'
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'

/**
 * Gets current user's entry in database and returns singular field from it.
 * @param {string} fieldName - name of the field
 */
export const getUserField = async (fieldName) => {
  try {
    const ref = doc(db, 'users', auth.currentUser.uid)
    const snapshot = await getDoc(ref)

    if (!snapshot.exists())
      throw Error('Document of current user does not exist in the database.')

    const ret = snapshot.get(fieldName)

    if (ret === undefined)
      throw Error(`Field of name ${fieldName} does not exist in user's database entry.`)

    return ret
  } catch (error) {
    console.error('getFieldFromUser:', error)
  }
}

export const updateUserMapField = async (fieldName, value) => {
  try {
    const ref = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(ref, { [fieldName]: value })
  } catch (error) {
    console.error('getFieldFromUser:', error)
  }
}

/**
 * Gets documents from a collection based on given conditions, or gets whole collection if no conditions were specified.
 * @param {string} collectionName - name of the db collection
 * @param {Array<Array<string>>} whereConditions - array of conditions, where each condition is an array with 3 values, as specified per firebase `where()` documentation
 */
export const getDocuments = async (collectionName, whereConditions = undefined) => {
  try {
    const ref = collection(db, collectionName)
    let snapshot = undefined

    if (Array.isArray(whereConditions)) {
      const conditionList = whereConditions
        .filter(conditions => Array.isArray(conditions) && conditions.length === 3)
        .map(conditions => where(...conditions))
      const q = query(ref, ...conditionList)
      snapshot = await getDocs(q)
    } else {
      snapshot = await getDocs(ref)
    }

    if (snapshot.empty)
      throw Error(`Documents of collection ${collectionName} do not exist.`)

    const ret = snapshot.docs.map(doc => doc.data())
    console.warn(ret)
    return ret
  } catch (error) {
    console.error('getFieldFromUser:', error)
  }
}
