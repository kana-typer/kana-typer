import { db } from '../config/firebase'
import { collection, doc, getDoc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore'

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

export const createInitialUserData = async (currentUser) => {
  try {
    const userRef = doc(db, 'users', currentUser.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      console.log('First login today')
      await setDoc(userRef, {
        firstLogin: Timestamp.fromDate(new Date())
      })
    } else {
      const userData = userDoc.data()
      console.log(`First login on ${userData.firstLogin.toDate().toString()}`)
    }
  } catch (error) {
    console.error('createInitialUserData:', error)
  }
}
