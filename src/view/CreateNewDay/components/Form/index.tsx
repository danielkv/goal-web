import { Component, Match, Switch, createMemo, createSignal } from 'solid-js'

import Breadcrumb from '@components/Breadcrumb'
import { IBreadcrumbItem } from '@components/Breadcrumb/types'
import { NestedKeyOf } from '@interfaces/app'
import { Day } from '@models/day'
import { breadCrumbLabelMaps } from '@view/CreateNewDay/config'
import { buildTree, getCurrentForm } from '@view/CreateNewDay/utils'

import DayForm from '../DayForm'
import GroupForm from '../GroupForm'
import RoundForm from '../RoundForm'
import BlockForm from '../blocks'

type CurrentPath = `day.${NestedKeyOf<Day>}` | 'day'

const [currentPath, setCurrentPath] = createSignal<CurrentPath>('day.groups.0.blocks.1')

const Form: Component = () => {
    const currentForm = createMemo(() => getCurrentForm(currentPath()))
    const breadcrumbItems = createMemo<IBreadcrumbItem[]>(() => {
        const tree = buildTree(currentPath())

        return tree.map((item, treeIndex) => {
            const [form, formIndex] = getCurrentForm(item)

            const formLabel = breadCrumbLabelMaps[form] || form
            const label = formIndex !== undefined ? `${formLabel} - ${formIndex}` : formLabel

            return {
                key: item,
                label,
                buttonDisabled: treeIndex + 1 >= tree.length,
            }
        })
    })

    return (
        <>
            <div class="flex flex-1 flex-col overflow-auto">
                <div class="flex flex-col p-8 gap-6">
                    <Breadcrumb
                        onClick={(key) => setCurrentPath(key as CurrentPath)}
                        items={breadcrumbItems()}
                    />

                    <Switch>
                        <Match when={currentForm()[0] === 'day'}>
                            <DayForm onClickNext={() => {}} />
                        </Match>
                        <Match when={currentForm()[0] === 'groups'}>
                            <GroupForm onClickNext={() => {}} />
                        </Match>
                        <Match when={currentForm()[0] === 'blocks'}>
                            <BlockForm block={{ type: '' }} onClickNext={() => {}} />
                        </Match>
                        <Match when={currentForm()[0] === 'rounds'}>
                            <RoundForm onClickNext={() => {}} />
                        </Match>
                    </Switch>
                </div>
            </div>
            <div class="paper flex flex-col gap-6 rounded-none">
                <button class="btn btn-main">Finalizar</button>
            </div>
        </>
    )
}

export default Form
