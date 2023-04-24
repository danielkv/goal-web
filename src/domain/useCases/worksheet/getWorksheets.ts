import { FUNCTION_CALL } from '@common/providers/firebase'
import { IWorksheetModel } from '@models/day'

const getWorksheetsFn = FUNCTION_CALL<never, IWorksheetModel[]>('getWorksheets')

export async function getWorksheetsUseCase(): Promise<IWorksheetModel[]> {
    const response = await getWorksheetsFn()

    return response.data
}
