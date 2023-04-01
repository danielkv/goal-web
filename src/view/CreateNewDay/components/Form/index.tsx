import { Component, Match, Switch, createMemo } from 'solid-js'
import { produce } from 'solid-js/store'

import Breadcrumb from '@components/Breadcrumb'
import { IBreadcrumbItem } from '@components/Breadcrumb/types'
import {
    breadCrumbLabelMaps,
    currentPath,
    initialBlockValues,
    initialDayValues,
    initialEventRoundValues,
    initialGroupValues,
    setCurrentPath,
    setDayStore,
} from '@view/CreateNewDay/config'
import { Path } from '@view/CreateNewDay/types'
import { buildTree, getCurrentForm, getCurrentObject } from '@view/CreateNewDay/utils'

import BlockForm from '../BlockForm'
import DayForm from '../DayForm'
import GroupForm from '../GroupForm'
import RoundForm from '../RoundForm'

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
                        <Match when={currentForm()[0] === 'days'}>
                            <DayForm
                                onClickNext={(data) => {
                                    const currDayIndex = currentForm()[2]['days']

                                    setDayStore(
                                        produce((d) => {
                                            const days = d.days
                                            if (days.length <= 0)
                                                return days.push({
                                                    ...data,
                                                    groups: [],
                                                })

                                            days[currDayIndex] = {
                                                ...data,
                                                groups: days[currDayIndex].groups,
                                            }
                                        })
                                    )
                                    setCurrentPath(`worksheet.days.${currDayIndex}.groups.0`)
                                }}
                                day={getCurrentObject(currentPath()) || initialDayValues}
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'groups'}>
                            <GroupForm
                                onClickNext={(data) => {
                                    const currGroupIndex = currentForm()[2]['groups']
                                    const currDayIndex = currentForm()[2]['days']

                                    setDayStore(
                                        produce((d) => {
                                            const groups = d.days[currDayIndex].groups
                                            if (groups.length <= 0)
                                                return groups.push({
                                                    ...data,
                                                    blocks: [],
                                                })

                                            groups[currGroupIndex] = {
                                                ...data,
                                                blocks: groups[currGroupIndex].blocks,
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
                                    const currDayIndex = currentForm()[2]['days']

                                    setDayStore(
                                        produce((d) => {
                                            const blocks =
                                                d.days[currDayIndex].groups[currGroupIndex].blocks
                                            if (blocks.length <= 0)
                                                return blocks.push({
                                                    ...data,
                                                })
                                            blocks[currBlockIndex] = {
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
                                    const currDayIndex = currentForm()[2]['days']

                                    setDayStore(
                                        produce((d) => {
                                            const block =
                                                d.days[currDayIndex].groups[currGroupIndex].blocks[
                                                    currBlockIndex
                                                ]

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
