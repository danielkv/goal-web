import { firebaseProvider } from '@common/providers/firebase'
import { IWorksheet } from '@models/day'

const saveWorksheetFn = firebaseProvider.FUNCTION_CALL<IWorksheet, IWorksheet>('saveWorksheet')

export async function saveWorksheetUseCase(worksheet: IWorksheet): Promise<IWorksheet> {
    const response = await saveWorksheetFn(worksheet)

    return response.data
}
