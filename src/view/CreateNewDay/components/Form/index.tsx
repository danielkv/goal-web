import { get, isNumber } from 'radash'

import { Component, createMemo, createSignal, onMount } from 'solid-js'

import Breadcrumb from '@components/Breadcrumb'
import { NestedKeyOf, Paths } from '@interfaces/app'
import { Day } from '@models/day'

import DayForm from '../DayForm'
import GroupForm from '../GroupForm'
import RoundForm from '../RoundForm'
import BlockForm from '../blocks'

type CurrentPath = `day.${NestedKeyOf<Day>}` | 'day'

const [currentPath, setCurrentPath] = createSignal<CurrentPath>('day.groups.0.name')

function extract(path: string) {
    const regex = /([\w\-]+)/gm
    const paths = [...path.matchAll(regex)].map((item) => Number(item[0]) || item[0])
    return paths
}

const currentForm = createMemo(() => {
    const extractedPaths = extract(currentPath())
    let lastPath = ''

    extractedPaths.forEach((item, index) => {
        if (!isNumber(item)) lastPath = item
    })

    return lastPath
})

const Form: Component = () => {
    return (
        <>
            <div class="flex flex-1 flex-col overflow-auto">
                <div class="flex flex-col p-8 gap-6">
                    <Breadcrumb items={[{ key: 'day', label: 'Dia', buttonDisabled: true }]} />

                    {/* <DayForm onClickNext={() => {}} /> */}

                    {/* <GroupForm onClickNext={() => {}} />  */}

                    {/* <EventBlockForm onClickNext={() => {}} /> */}

                    {/* <RoundForm onClickNext={() => {}} /> */}

                    {/* <RestBlockForm onClickNext={() => {}} /> */}

                    <BlockForm block={{ type: '' }} onClickNext={() => {}} />
                </div>
            </div>
            <div class="paper flex flex-col gap-6 rounded-none">
                <button class="btn btn-main">Finalizar</button>
            </div>
        </>
    )
}

export default Form
