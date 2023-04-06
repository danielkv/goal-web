import { Component, createEffect, createSignal } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

import WorksheetPreview from '@components/WorksheetPreview'
import { loggedUser } from '@contexts/user/user.context'
import { Path } from '@interfaces/app'
import { Worksheet } from '@models/day'
import { useNavigate, useParams } from '@solidjs/router'
import { getWorksheetByIdUseCase } from '@useCases/worksheet/getWorksheetById'
import { getErrorMessage } from '@utils/errors'
import { getLastIndex, getPeaceFromPath, pathToParent } from '@utils/paths'
import { createWorksheetValues } from '@utils/worksheetInitials'

import Form from './components/Form'

const CreateNewDay: Component = () => {
    const [loading, setLoading] = createSignal(false)
    const [error, setError] = createSignal<string | null>(null)

    const [currentPath, setCurrentPath] = createSignal<Path>('worksheet')

    const navigate = useNavigate()

    const [worksheetStore, setWorksheetStore] = createStore<Worksheet>(createWorksheetValues())

    createEffect(() => {
        if (!loggedUser()) navigate('/login', { replace: true })
    })

    createEffect(() => {
        const params = useParams()

        if (params.id) loadWorksheet(params.id)
        else setWorksheetStore(createWorksheetValues())
    })

    const handleRemovePeace = <Values,>(path: Path) => {
        const listPath = pathToParent(path)
        const lastIndex = getLastIndex(path)
        const returnPath = pathToParent(path, 2)

        setWorksheetStore(
            produce((current) => {
                const list = getPeaceFromPath<Values[]>(current, listPath)

                list.splice(lastIndex, 1)
            })
        )

        setTimeout(() => {
            setCurrentPath(returnPath)
        }, 1)
    }

    const handleAddPeace = <Values,>(
        path: Path,
        initialValues: Values,
        override?: Partial<Values>
    ) => {
        const listPath = pathToParent(path)
        const lastIndex = getLastIndex(path)

        setWorksheetStore(
            produce((current) => {
                const list = getPeaceFromPath<Values[]>(current, listPath)

                list.splice(lastIndex, 0, { ...initialValues, ...override })

                //return current
            })
        )
        setTimeout(() => {
            setCurrentPath(path)
        }, 1)
    }

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
                            item={worksheetStore}
                            onClickPeace={(key) => setCurrentPath(key)}
                            onAdd={handleAddPeace}
                            onRemove={handleRemovePeace}
                        />
                        <pre>{JSON.stringify(worksheetStore, null, 4)}</pre>
                    </>
                )}
            </div>
            <div class="bg-gray-500 flex flex-col basis-auto">
                <Form
                    worksheet={worksheetStore}
                    handleSetWorksheet={setWorksheetStore}
                    currentPath={currentPath()}
                    handleSetPath={setCurrentPath}
                />
            </div>
        </div>
    )
}

export default CreateNewDay
