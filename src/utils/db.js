import { auth, db } from '../config/firebase'
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, Timestamp, updateDoc } from 'firebase/firestore'

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

export const deleteAnonymousUser = async () => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid)
    await deleteDoc(userRef)
    await auth.currentUser.delete()
  } catch (error) {
    console.error('deleteUser:', error)
  }
}

export const deleteAnonymousUserData = async () => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid)
    await deleteDoc(userRef)
  } catch (error) {
    console.error('deleteUser:', error)
  }
}

export const deleteAnonymousUserAuth = async (user) => {
  try {
    await user.delete()
  } catch (error) {
    console.error('deleteUser:', error)
  }
}
