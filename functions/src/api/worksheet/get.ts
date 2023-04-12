import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'

import { init } from '../../helpers'

init()

export const getWorksheetById = https.onCall(async (worksheetId: string, context: https.CallableContext) => {
    const db = admin.firestore()

    const collection = db.collection('worksheets')

    const doc = await collection.doc(worksheetId).get()

    if (!doc.exists) throw new Error('Worksheet not found')

    return {
        id: doc.id,
        days: await getDays(doc.ref),
        ...doc.data(),
    }
})

export const getWorksheets = https.onCall(async (none: any, context: https.CallableContext) => {
    const db = admin.firestore()

    const snapshot = await db.collection('worksheets').get()

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
})

async function getDays(worksheetDocRef: admin.firestore.DocumentReference) {
    const daysDocs = await worksheetDocRef.collection('days').orderBy('date').get()

    return daysDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
}
