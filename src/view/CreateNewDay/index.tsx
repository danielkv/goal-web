import { Component, createEffect, createSignal } from 'solid-js'

import { useParams } from '@solidjs/router'
import { getWorksheetByIdUseCase } from '@useCases/worksheet/getWorksheetById'
import { getErrorMessage } from '@utils/errors'

import Form from './components/Form'
import WorksheetPreview from './components/WorksheetPreview'
import { currentPath, setCurrentPath, setWorksheetStore, worksheetStore } from './config'

const CreateNewDay: Component = () => {
    const [loading, setLoading] = createSignal(false)
    const [error, setError] = createSignal<string | null>(null)

    createEffect(() => {
        const params = useParams()

        if (params.id) loadWorksheet(params.id)
    })

    async function loadWorksheet(worksheetId: string) {
        try {
            setError(null)
            setLoading(true)

            const worksheet = await getWorksheetByIdUseCase(worksheetId)

            setWorksheetStore(worksheet)
        } catch (err) {
            const error = getErrorMessage(err)
            alert(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div
            class="grid w-full"
            style={{
                'grid-template-columns': 'auto minmax(27%, 450px)',
                'grid-template-rows': '100%',
                height: 'calc(100% - 80px)',
            }}
        >
            <div class="flex flex-1 flex-col basis-auto overflow-auto">
                {error() ? (
                    <div class="flex-1 text-center m-10">{error()}</div>
                ) : loading() ? (
                    <div class="flex-1 text-center m-10">Carregando...</div>
                ) : (
                    <>
                        <WorksheetPreview
                            currentPath={currentPath()}
                            worksheet={worksheetStore}
                            onClickPeace={(key) => setCurrentPath(key)}
                        />
                        <pre>{JSON.stringify(worksheetStore, null, 4)}</pre>
                    </>
                )}
            </div>
            <div class="bg-gray-500 flex flex-col basis-auto">
                <Form />
            </div>
        </div>
    )
}

export default CreateNewDay
