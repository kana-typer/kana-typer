import 'dotenv/config'
import { beforeAll, describe, expect, it } from 'vitest'
import { connectFirestoreEmulator, collection, getDocs } from 'firebase/firestore'

import { db } from '../config/firebase'


describe('', () => {
  beforeAll(() => {
    connectFirestoreEmulator(db, 'localhost', 9001)
  })

  it('', async () => {
    const ref = collection(db, 'mora')
    const snapshot = await getDocs(ref)
    const data = snapshot.docs.map(doc => doc.data())

    console.log(data)

    expect(data).toEqual([])
  })
})
