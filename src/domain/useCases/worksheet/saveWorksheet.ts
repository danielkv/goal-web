import { FUNCTION_CALL } from '@common/providers/firebase'
import { Worksheet } from '@models/day'

const saveWorksheetFn = FUNCTION_CALL<Worksheet, Worksheet>('saveWorksheet')

export async function saveWorksheetUseCase(worksheet: Worksheet): Promise<Worksheet> {
    const response = await saveWorksheetFn(worksheet)

    return response.data
}
