import { Component } from 'solid-js'

import Form from './components/Form'
import { dayStore } from './config'

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
            <div class="">
                <pre>{JSON.stringify(dayStore, null, 4)}</pre>
            </div>
            <div class="bg-gray-500 flex flex-col basis-auto">
                <Form />
            </div>
        </div>
    )
}

export default CreateNewDay
