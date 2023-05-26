import { firebaseProvider } from '@common/providers/firebase'

const toggleWorksheetPublishedFn = firebaseProvider.FUNCTION_CALL<string, void>('toggleWorksheetPublished')

export async function toggleWorksheetPublishedUseCase(worksheetId: string): Promise<void> {
    await toggleWorksheetPublishedFn(worksheetId)
}
