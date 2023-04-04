import { firestore } from 'firebase-admin'
import { https } from 'firebase-functions'

import { init } from '../helpers'

export const saveWorksheet = https.onCall((worksheet: any, context: https.CallableContext) => {
    init()

    return createWorksheetUseCase(worksheet)
})

async function createWorksheetUseCase(data: Record<string, any>) {
    const worksheetRef = firestore().collection('worksheets')

    const created = await worksheetRef.add(data)

    return {
        id: created.id,
        ...data,
    }
}

//function updateWorksheetUseCase(worksheet: Record<string, any>, response: VercelResponse): {}
