import { firebaseProvider } from '@common/providers/firebase'
import { IWorksheetModel } from '@models/day'

type TGetWorksheetsFilter = {
    includeNotPublished?: boolean
}

const getWorksheetsFn = firebaseProvider.FUNCTION_CALL<TGetWorksheetsFilter, IWorksheetModel[]>('getWorksheets')

export async function getWorksheetsUseCase(): Promise<IWorksheetModel[]> {
    const response = await getWorksheetsFn({ includeNotPublished: true })

    return response.data
}
