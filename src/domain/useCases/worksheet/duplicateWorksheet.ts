import { FUNCTION_CALL } from '@common/providers/firebase'
import { IWorksheet } from '@models/day'

const duplicateWorksheetFn = FUNCTION_CALL<string, IWorksheet>('duplicateWorksheet')

export async function duplicateWorksheetUseCase(worksheetId: string): Promise<IWorksheet> {
    const response = await duplicateWorksheetFn(worksheetId)

    return response.data
}
