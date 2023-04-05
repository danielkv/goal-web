import { FUNCTION_CALL } from '@common/providers/firebase'
import { WorksheetModel } from '@models/day'

const getWorksheetsFn = FUNCTION_CALL<never, WorksheetModel[]>('getWorksheets')

export async function getWorksheetsUseCase(): Promise<WorksheetModel[]> {
    const response = await getWorksheetsFn()

    return response.data
}
