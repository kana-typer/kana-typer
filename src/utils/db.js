import { auth, db } from '../config/firebase'
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore'

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

/**
 * @deprecated
 */
export const testDbStatus = () => {
  try {
    onSnapshot(collection(db, 'test'), snapshot => {
      const docArr = snapshot.docs.map(doc => doc.data())
      console.log(`Connection to db successful, isActive=${docArr?.[0]?.isActive}`)
    })
  }
   catch (error) {
    console.error('testDbStatus:', error)
  }
}

/**
 * @deprecated
 */
export const deleteDocumentAndSubCollections = async (docRef) => {
  const deleteCollection = async (name, silent = true) => {
    try {
      const collectionRef = collection(db, `${docRef.path}/${name}`)
      const docsSnapshot = await getDocs(collectionRef)

      docsSnapshot.forEach(doc => {
        console.log('sub:', doc.data())
      })
    } catch (error) {
      if (!silent)
        console.error('deleteDocumentAndSubCollections.deleteCollection: error deleting collection')
    }
  }

  try {
    const docSnapshot = await getDoc(docRef)
    const data = docSnapshot.data()

    console.log(data)

    await deleteCollection('test', false)
  } catch (error) {
    console.error('deleteDocumentAndSubCollections:', error)
  }
}

/**
 * @deprecated
 */
export const createOrReadAnonymousUserData = async () => {
  try {
    if (!auth.currentUser.isAnonymous)
      throw Error('function called on non-anonymous user')

    const userRef = doc(db, 'users', auth.currentUser.uid)
    const userDoc = await getDoc(userRef)
    const today = new Date()

    if (!userDoc.exists()) {
      console.log('Signed in today')

      await setDoc(userRef, {
        signedOn: Timestamp.fromDate(today),
        lastLoginOn: Timestamp.fromDate(today),
        isAnonymous: auth.currentUser.isAnonymous,
      })
    } else {
      await updateDoc(userRef, {
        lastLoginOn: Timestamp.fromDate(today),
      })

      const userData = userDoc.data()
      console.log(`First sign in on ${userData?.signedOn?.toDate()?.toString()}`)
      console.log(`Last login on ${userData?.lastLoginOn?.toDate().toString()}`)
    }
  } catch (error) {
    console.error('createAnonymousUserData:', error)
  }
}

/**
 * @deprecated
 */
export const deleteAnonymousUser = async () => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid)
    await deleteDoc(userRef)
    await auth.currentUser.delete()
  } catch (error) {
    console.error('deleteUser:', error)
  }
}

/**
 * @deprecated
 */
export const deleteAnonymousUserData = async () => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid)
    await deleteDoc(userRef)
  } catch (error) {
    console.error('deleteUser:', error)
  }
}

/**
 * @deprecated
 */
export const deleteAnonymousUserAuth = async (user) => {
  try {
    await user.delete()
  } catch (error) {
    console.error('deleteUser:', error)
  }
}
