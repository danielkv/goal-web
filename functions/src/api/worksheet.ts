import { firestore } from 'firebase-admin'
import { https } from 'firebase-functions'

import { init } from '../helpers'

export const saveWorksheet = https.onCall(
    (worksheet: Record<string, any>, context: https.CallableContext) => {
        init()

        if (worksheet.id) return updateWorksheetUseCase(worksheet)

        return createWorksheetUseCase(worksheet)
    }
)

async function createWorksheetUseCase({ days, ...worksheet }: Record<string, any>) {
    const worksheetRef = firestore().collection('worksheets')

    const batch = firestore().batch()

    const worksheetDocRef = worksheetRef.doc()
    batch.create(worksheetDocRef, worksheet)

    const createdDays = saveDaysUseCase(batch, worksheetDocRef, days)

    await batch.commit()

    return {
        id: worksheetDocRef.id,
        days: createdDays,
        ...worksheet,
    }
}

async function updateWorksheetUseCase({ days, ...worksheet }: Record<string, any>) {
    const worksheetRef = firestore().collection('worksheets')

    const batch = firestore().batch()

    const worksheetDocRef = worksheetRef.doc(worksheet.id)
    batch.set(worksheetDocRef, worksheet)

    const createdDays = saveDaysUseCase(batch, worksheetDocRef, days)

    await batch.commit()

    return {
        id: worksheetDocRef.id,
        days: createdDays,
        ...worksheet,
    }
}

function saveDaysUseCase(
    batch: firestore.WriteBatch,
    worksheetRef: firestore.DocumentReference,
    days: Record<string, any>[]
) {
    const dayRef = worksheetRef.collection('days')

    days.forEach((day) => {
        if (!day.id) {
            const dayDocRef = dayRef.doc()
            batch.create(dayDocRef, day)

            day.id = dayDocRef.id
        } else {
            const dayDocRef = dayRef.doc(day.id)
            batch.set(dayDocRef, day)
        }
    })

    return days
}