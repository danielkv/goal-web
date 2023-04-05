import { FUNCTION_CALL } from '@common/providers/firebase'
import { WorksheetModel } from '@models/day'

const getWorksheetByIdFn = FUNCTION_CALL<string, WorksheetModel>('getWorksheetById')

export async function getWorksheetByIdUseCase(worksheetId: string): Promise<WorksheetModel> {
    const response = await getWorksheetByIdFn(worksheetId)

    return response.data
}
