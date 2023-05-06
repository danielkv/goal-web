import { FUNCTION_CALL } from '@common/providers/firebase'
import { IWorksheet } from '@models/day'

const removeWorksheetFn = FUNCTION_CALL<string, IWorksheet>('removeWorksheet')

export async function removeWorksheetUseCase(worksheetId: string): Promise<IWorksheet> {
    const response = await removeWorksheetFn(worksheetId)

    return response.data
}
