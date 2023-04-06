import { Component, For, Suspense, createResource } from 'solid-js'

import WorksheetItem from '@components/WorksheetItem'
import { useNavigate } from '@solidjs/router'
import { getWorksheetsUseCase } from '@useCases/worksheet/getWorksheets'

const WorksheetList: Component = () => {
    const [list] = createResource(getWorksheetsUseCase)

    const navigate = useNavigate()

    const handleClickWorksheetItem = (worksheetId: string) => () => {
        navigate(`/worksheet/${worksheetId}`)
    }

    const handleClickWorksheetNew = () => {
        navigate(`/worksheet/new`)
    }

    return (
        <div class="p-10">
            <Suspense fallback={<div>Carregando...</div>}>
                <div class="flex">
                    <For each={list()}>
                        {(worksheet) => (
                            <WorksheetItem
                                worksheet={worksheet}
                                onClick={handleClickWorksheetItem(worksheet.id)}
                            />
                        )}
                    </For>
                    <WorksheetItem onClick={handleClickWorksheetNew} />
                </div>
            </Suspense>
        </div>
    )
}

export default WorksheetList
