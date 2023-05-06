import { Component, For, Show, Suspense, createEffect, createResource, createSignal } from 'solid-js'

import WorksheetItem from '@components/WorksheetItem'
import { loggedUser } from '@contexts/user/user.context'
import { useNavigate } from '@solidjs/router'
import { duplicateWorksheetUseCase } from '@useCases/worksheet/duplicateWorksheet'
import { getWorksheetsUseCase } from '@useCases/worksheet/getWorksheets'
import { removeWorksheetUseCase } from '@useCases/worksheet/removeWorksheet'

const WorksheetList: Component = () => {
    const [list, { refetch }] = createResource(getWorksheetsUseCase)
    const [loading, setLoading] = createSignal(false)

    const navigate = useNavigate()

    const handleClickWorksheetItem = (worksheetId: string) => () => {
        navigate(`/worksheet/${worksheetId}`)
    }

    const handleClickWorksheetNew = () => {
        navigate(`/worksheet/new`)
    }

    createEffect(() => {
        if (!loggedUser()) navigate('/login', { replace: true })
    })

    const handleDuplicateWorksheet = async (worksheetId: string) => {
        setLoading(true)

        await duplicateWorksheetUseCase(worksheetId)

        setLoading(false)

        refetch()
    }

    const handleRemoveWorksheet = async (worksheetId: string) => {
        const confirmation = confirm('Tem certeza que deseja excluir essa planilha?')
        if (!confirmation) return

        setLoading(true)

        await removeWorksheetUseCase(worksheetId)

        setLoading(false)

        refetch()
    }

    return (
        <div class="p-10">
            <Show when={!loading()}>
                <Suspense fallback={<div>Carregando...</div>}>
                    <div class="flex">
                        <For each={list()}>
                            {(worksheet) => (
                                <WorksheetItem
                                    worksheet={worksheet}
                                    onClick={handleClickWorksheetItem(worksheet.id)}
                                    onClickDuplicate={handleDuplicateWorksheet}
                                    onClickRemove={handleRemoveWorksheet}
                                />
                            )}
                        </For>
                        <WorksheetItem onClick={handleClickWorksheetNew} />
                    </div>
                </Suspense>
            </Show>
            <Show when={loading()}>
                <div>Carregando...</div>
            </Show>
        </div>
    )
}

export default WorksheetList
