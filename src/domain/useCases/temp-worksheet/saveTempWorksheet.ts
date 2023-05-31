import { firebaseProvider } from '@common/providers/firebase'
import { IWorksheetModel } from '@models/day'
import { dayConverter, worksheetConverter } from '@utils/converters'

export async function saveTempWorksheetUseCase(worksheet: IWorksheetModel): Promise<IWorksheetModel> {
    if (!worksheet.id) throw new Error('A planilha deve ser salva antes de ter um histórico temporário')

    const docRef = firebaseProvider.firestore().doc('temp_worksheets', worksheet.id).withConverter(worksheetConverter)

    const worksheetResult: IWorksheetModel = await firebaseProvider
        .firestore()
        .runTransaction(firebaseProvider.getFirestore(), async (transaction) => {
            transaction.set(docRef, worksheet)

            worksheet.days.forEach((day) => {
                if (!day.id) throw new Error('A planilha deve ser salva antes de ter um histórico temporário')

                const dayDocRef = firebaseProvider
                    .firestore()
                    .doc('temp_worksheets', docRef.id, 'days', day.id)
                    .withConverter(dayConverter)

                transaction.set(dayDocRef, day)
            })

            return worksheet
        })

    return worksheetResult
}
