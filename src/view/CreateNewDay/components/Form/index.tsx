import { get } from 'radash'

import { Component, Match, Switch, createMemo } from 'solid-js'
import { produce } from 'solid-js/store'

import Breadcrumb from '@components/Breadcrumb'
import { IBreadcrumbItem } from '@components/Breadcrumb/types'
import { Day } from '@models/day'
import {
    breadCrumbLabelMaps,
    currentPath,
    dayStore,
    initialBlockValues,
    initialDayValues,
    initialEventRoundValues,
    initialGroupValues,
    setCurrentPath,
    setDayStore,
} from '@view/CreateNewDay/config'
import { Path } from '@view/CreateNewDay/types'
import { buildTree, getCurrentForm } from '@view/CreateNewDay/utils'

import BlockForm from '../BlockForm'
import DayForm from '../DayForm'
import GroupForm from '../GroupForm'
import RoundForm from '../RoundForm'

function getCurrentObject<T>(path: string): T {
    const normalizedPath = path.replace(/day.?/, '')
    const object = get<Day, T>(dayStore, normalizedPath)

    return object as T
}

const Form: Component = () => {
    const currentForm = createMemo(() => getCurrentForm(currentPath()))
    const breadcrumbItems = createMemo<IBreadcrumbItem[]>(() => {
        const path = currentPath()
        const tree = buildTree(path)

        return tree.map((item, treeIndex) => {
            const [form, formIndex] = getCurrentForm(item)

            const formLabel = breadCrumbLabelMaps[form] || form
            const label = formIndex !== -1 ? `${formLabel} - ${formIndex}` : formLabel

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
                        onClick={(key) => setCurrentPath(key as Path)}
                        items={breadcrumbItems()}
                    />

                    <Switch>
                        <Match when={currentForm()[0] === 'day'}>
                            <DayForm
                                onClickNext={(data) => {
                                    setDayStore({ ...data })
                                    setCurrentPath('day.groups.0')
                                }}
                                day={getCurrentObject(currentPath()) || initialDayValues}
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'groups'}>
                            <GroupForm
                                onClickNext={(data) => {
                                    const currGroupIndex = currentForm()[2]['groups']

                                    setDayStore(
                                        produce((d) => {
                                            if (d.groups.length <= 0)
                                                return d.groups.push({ ...data, blocks: [] })

                                            d.groups[currGroupIndex] = {
                                                ...data,
                                                blocks: d.groups[currGroupIndex].blocks,
                                            }
                                        })
                                    )
                                    setCurrentPath(`${currentPath()}.blocks.0` as Path)
                                }}
                                group={getCurrentObject(currentPath()) || initialGroupValues}
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'blocks'}>
                            <BlockForm
                                block={getCurrentObject(currentPath()) || initialBlockValues}
                                onClickNext={(data) => {
                                    const currGroupIndex = currentForm()[2]['groups']
                                    const currBlockIndex = currentForm()[2]['blocks']

                                    setDayStore(
                                        produce((d) => {
                                            if (d.groups[currGroupIndex].blocks.length <= 0)
                                                return d.groups[currGroupIndex].blocks.push({
                                                    ...data,
                                                })
                                            d.groups[currGroupIndex].blocks[currBlockIndex] = {
                                                ...data,
                                            }
                                        })
                                    )

                                    setCurrentPath(`${currentPath()}.rounds.0` as Path)
                                }}
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'rounds'}>
                            <RoundForm
                                onClickNext={(data) => {
                                    const currGroupIndex = currentForm()[2]['groups']
                                    const currBlockIndex = currentForm()[2]['blocks']
                                    const currRoundsIndex = currentForm()[2]['rounds']

                                    console.log(data)

                                    setDayStore(
                                        produce((d) => {
                                            const block =
                                                d.groups[currGroupIndex].blocks[currBlockIndex]

                                            if (block.type !== 'event') return

                                            if (block.rounds.length <= 0)
                                                return block.rounds.push({
                                                    ...data,
                                                })

                                            block.rounds[currRoundsIndex] = {
                                                ...data,
                                            }
                                        })
                                    )

                                    setCurrentPath(`${currentPath()}.rounds.0` as Path)
                                }}
                                round={getCurrentObject(currentPath()) || initialEventRoundValues}
                            />
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
