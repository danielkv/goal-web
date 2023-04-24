import { FUNCTION_CALL } from '@common/providers/firebase'
import { IWorksheetModel } from '@models/day'

const getWorksheetByIdFn = FUNCTION_CALL<string, IWorksheetModel>('getWorksheetById')

export async function getWorksheetByIdUseCase(worksheetId: string): Promise<IWorksheetModel> {
    const response = await getWorksheetByIdFn(worksheetId)

    return response.data
}
