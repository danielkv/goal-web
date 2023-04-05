import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'

import { init } from '../../helpers'

init()

export const saveWorksheet = https.onCall(
    (worksheet: Record<string, any>, context: https.CallableContext) => {
        // if (worksheet.id) return updateWorksheetUseCase(worksheet)

        return createWorksheetUseCase(worksheet)
    }
)

function createWorksheetUseCase({ days, ...worksheet }: Record<string, any>) {
    const db = admin.firestore()

    return db.runTransaction(async (transaction) => {
        const worksheetRef = db.collection('worksheets')

        const worksheetDocRef = worksheet.id ? worksheetRef.doc(worksheet.id) : worksheetRef.doc()

        if (!worksheet.id) {
            transaction.create(worksheetDocRef, worksheet)
        } else {
            transaction.update(worksheetDocRef, worksheet)
        }

        const createdDays = await saveDaysUseCase(transaction, worksheetDocRef, days)

        return {
            id: worksheetDocRef.id,
            days: createdDays,
            ...worksheet,
        }
    })
}

async function saveDaysUseCase(
    transaction: admin.firestore.Transaction,
    worksheetRef: admin.firestore.DocumentReference,
    days: Record<string, any>[]
) {
    const dayRef = worksheetRef.collection('days')

    // clear all docs from days
    const currentDocs = await dayRef.listDocuments()

    currentDocs.forEach((doc) => {
        transaction.delete(doc)
    })

    days.forEach((day) => {
        const dayDocRef = dayRef.doc()
        transaction.create(dayDocRef, day)
    })

    return days
}
