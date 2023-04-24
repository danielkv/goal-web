import { FUNCTION_CALL } from '@common/providers/firebase'
import { IWorksheet } from '@models/day'

const saveWorksheetFn = FUNCTION_CALL<IWorksheet, IWorksheet>('saveWorksheet')

export async function saveWorksheetUseCase(worksheet: IWorksheet): Promise<IWorksheet> {
    const response = await saveWorksheetFn(worksheet)

    return response.data
}
