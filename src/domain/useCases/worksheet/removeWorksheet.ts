import { firebaseProvider } from '@common/providers/firebase'
import { IWorksheet } from '@models/day'

const removeWorksheetFn = firebaseProvider.FUNCTION_CALL<string, IWorksheet>('removeWorksheet')

export async function removeWorksheetUseCase(worksheetId: string): Promise<IWorksheet> {
    const response = await removeWorksheetFn(worksheetId)

    return response.data
}
