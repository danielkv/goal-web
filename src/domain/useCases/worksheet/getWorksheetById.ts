import { FUNCTION_CALL } from '@common/providers/firebase'
import { Worksheet } from '@models/day'

const getWorksheetByIdFn = FUNCTION_CALL<string, Worksheet>('getWorksheetById')

export async function getWorksheetByIdUseCase(worksheetId: string): Promise<Worksheet> {
    const response = await getWorksheetByIdFn(worksheetId)

    return response.data
}
