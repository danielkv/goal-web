import { FiEye } from 'solid-icons/fi'

import { Component, createEffect, createSignal } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

import WorksheetPreview from '@components/WorksheetPreview'
import { loggedUser } from '@contexts/user/user.context'
import { Path } from '@interfaces/app'
import { Worksheet } from '@models/day'
import { useNavigate, useParams } from '@solidjs/router'
import { getWorksheetByIdUseCase } from '@useCases/worksheet/getWorksheetById'
import { getErrorMessage } from '@utils/errors'
import { findNextIndexPath, findPreviousIndexPath, getLastIndex, getPeaceFromPath, pathToParent } from '@utils/paths'
import { createWorksheetValues } from '@utils/worksheetInitials'

import Form from './components/Form'

const CreateNewDay: Component = () => {
    const [loading, setLoading] = createSignal(false)
    const [error, setError] = createSignal<string | null>(null)

    const [currentPath, setCurrentPath] = createSignal<Path>('' as Path)

    const navigate = useNavigate()

    const [worksheetStore, setWorksheetStore] = createStore<Worksheet>(createWorksheetValues())

    createEffect(() => {
        if (!loggedUser()) navigate('/login', { replace: true })
    })

    createEffect(() => {
        const params = useParams()

        if (params.id) loadWorksheet(params.id)
        else {
            setWorksheetStore(createWorksheetValues())
            setCurrentPath('worksheet')
        }
    })

    const handleViewWorksheet = () => {
        if (!worksheetStore.id) return

        navigate(`/worksheet/view/${worksheetStore.id}`)
    }

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

    const handleAddPeace = <Values,>(path: Path, initialValues: Values, override?: Partial<Values>) => {
        const listPath = pathToParent(path)
        const lastIndex = getLastIndex(path)
        const newValue = { ...initialValues, ...override }

        setWorksheetStore(
            produce((current) => {
                const list = getPeaceFromPath<Values[]>(current, listPath)

                list.splice(lastIndex, 0, newValue)
            })
        )
        setTimeout(() => {
            setCurrentPath(path)
        }, 1)
    }

    const handleMovePeace = (path: Path, to: 'up' | 'down') => {
        const currentListPath = pathToParent(path)
        const currentIndex = getLastIndex(path)

        const newPath =
            to === 'up' ? findPreviousIndexPath(worksheetStore, path) : findNextIndexPath(worksheetStore, path)

        if (!newPath) return

        const newListPath = pathToParent(newPath)
        const newIndex = getLastIndex(newPath)

        setWorksheetStore(
            produce((current) => {
                const currentObject = getPeaceFromPath<Record<string, any>>(current, path)

                const currentList = getPeaceFromPath<Record<string, any>[]>(current, currentListPath)
                const newList = getPeaceFromPath<Record<string, any>[]>(current, newListPath)

                currentList.splice(currentIndex, 1)
                newList.splice(newIndex, 0, currentObject)
            })
        )
        setTimeout(() => {
            setCurrentPath(newPath)
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
                <div class="h-[80px] bg-gray-700 flex gap-6 items-center px-6 justify-end p-3">
                    <button
                        disabled={!worksheetStore.id}
                        class="bg-gray-900 p-3 rounded-full hover:bg-gray-700"
                        onClick={handleViewWorksheet}
                        title="Abrir visualização"
                    >
                        <FiEye size={22} />
                    </button>
                </div>
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
                            onMove={handleMovePeace}
                        />
                    </>
                )}
            </div>
            <div class="bg-gray-700 flex flex-col basis-auto">
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
