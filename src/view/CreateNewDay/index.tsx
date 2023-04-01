import { Component } from 'solid-js'

import Form from './components/Form'
import WorksheetPreview from './components/WorksheetPreview'
import { currentPath, setCurrentPath, worksheetStore } from './config'

const CreateNewDay: Component = () => {
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
                <WorksheetPreview
                    currentPath={currentPath()}
                    worksheet={worksheetStore}
                    onClickPeace={(key) => setCurrentPath(key)}
                />
                <pre>{JSON.stringify(worksheetStore, null, 4)}</pre>
            </div>
            <div class="bg-gray-500 flex flex-col basis-auto">
                <Form />
            </div>
        </div>
    )
}

export default CreateNewDay
