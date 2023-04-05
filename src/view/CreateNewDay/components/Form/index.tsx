import { Component, Match, Switch, createMemo } from 'solid-js'
import { produce } from 'solid-js/store'

import Breadcrumb from '@components/Breadcrumb'
import { IBreadcrumbItem } from '@components/Breadcrumb/types'
import { Block } from '@models/block'
import { Day, Group, Period } from '@models/day'
import { saveWorksheetUseCase } from '@useCases/worksheet/saveWorksheet'
import {
    currentPath,
    initialBlockValues,
    initialDayValues,
    initialEventRoundValues,
    initialGroupValues,
    initialPeriodValues,
    initialWorksheetValues,
    setCurrentPath,
    setWorksheetStore,
    worksheetStore,
} from '@view/CreateNewDay/config'
import { Path } from '@view/CreateNewDay/types'
import {
    buildTree,
    getBreadcrumbLabel,
    getCurrentForm,
    getCurrentObject,
} from '@view/CreateNewDay/utils'

import BlockForm from '../BlockForm'
import DayForm from '../DayForm'
import GroupForm from '../GroupForm'
import PeriodForm from '../PeriodForm'
import RoundForm from '../RoundForm'
import WorksheetForm from '../WorksheetForm'

const Form: Component = () => {
    const currentForm = createMemo(() => getCurrentForm(currentPath()))
    const breadcrumbItems = createMemo<IBreadcrumbItem[]>(() => {
        const path = currentPath()
        const tree = buildTree(path)

        return tree.map((item, treeIndex) => {
            const label = getBreadcrumbLabel(item)

            return {
                key: item,
                label,
                buttonDisabled: treeIndex + 1 >= tree.length,
            }
        })
    })

    const handleClickFinishButton = async () => {
        const result = await saveWorksheetUseCase(worksheetStore)

        setWorksheetStore(result)
    }

    return (
        <>
            <div class="flex flex-1 flex-col overflow-auto">
                <div class="flex flex-col p-8 gap-4">
                    <Breadcrumb
                        onClick={(key) => setCurrentPath(key as Path)}
                        items={breadcrumbItems()}
                    />

                    <Switch>
                        <Match when={currentForm()[0] === 'worksheet'}>
                            <WorksheetForm
                                onClickNext={(data) => {
                                    setWorksheetStore({ ...data, days: worksheetStore.days || [] })

                                    if (!worksheetStore.days.length)
                                        setCurrentPath(`worksheet.days.0`)
                                }}
                                worksheet={
                                    getCurrentObject(currentPath()) || initialWorksheetValues
                                }
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'days'}>
                            <DayForm
                                onClickNext={(data) => {
                                    const currDayIndex = currentForm()[2]['days']

                                    setWorksheetStore(
                                        produce((d) => {
                                            const days = d.days
                                            if (days.length <= 0)
                                                return days.push({
                                                    ...data,
                                                    periods: [],
                                                })

                                            days[currDayIndex] = {
                                                ...data,
                                                periods: days[currDayIndex].periods,
                                            }
                                        })
                                    )

                                    const day = getCurrentObject<Day>(currentPath())
                                    if (!day.periods.length)
                                        setCurrentPath(`worksheet.days.${currDayIndex}.periods.0`)
                                }}
                                day={getCurrentObject(currentPath()) || initialDayValues}
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'periods'}>
                            <PeriodForm
                                onClickNext={(data) => {
                                    const currentFormIndexes = currentForm()[2]
                                    const currDayIndex = currentFormIndexes['days']
                                    const currPeriodIndex = currentFormIndexes['periods']

                                    setWorksheetStore(
                                        produce((d) => {
                                            const periods = d.days[currDayIndex].periods
                                            if (periods.length <= 0)
                                                return periods.push({
                                                    ...data,
                                                    groups: [],
                                                })

                                            periods[currDayIndex] = {
                                                ...data,
                                                groups: periods[currPeriodIndex].groups,
                                            }
                                        })
                                    )
                                    const period = getCurrentObject<Period>(currentPath())
                                    if (!period.groups.length)
                                        setCurrentPath(
                                            `worksheet.days.${currDayIndex}.periods.${currPeriodIndex}.groups.0`
                                        )
                                }}
                                period={getCurrentObject(currentPath()) || initialPeriodValues}
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'groups'}>
                            <GroupForm
                                onClickNext={(data) => {
                                    const currGroupIndex = currentForm()[2]['groups']
                                    const currDayIndex = currentForm()[2]['days']
                                    const currPeriodIndex = currentForm()[2]['periods']

                                    setWorksheetStore(
                                        produce((d) => {
                                            const groups =
                                                d.days[currDayIndex].periods[currPeriodIndex].groups
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
                                    const group = getCurrentObject<Group>(currentPath())
                                    if (!group.blocks.length)
                                        setCurrentPath(`${currentPath()}.blocks.0` as Path)
                                }}
                                group={getCurrentObject(currentPath()) || initialGroupValues}
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'blocks'}>
                            <BlockForm
                                block={getCurrentObject(currentPath()) || initialBlockValues}
                                onClickNext={(data) => {
                                    const currentFormIndexes = currentForm()[2]
                                    const currGroupIndex = currentFormIndexes['groups']
                                    const currBlockIndex = currentFormIndexes['blocks']
                                    const currDayIndex = currentFormIndexes['days']
                                    const currPeriodIndex = currentFormIndexes['periods']

                                    setWorksheetStore(
                                        produce((d) => {
                                            const blocks =
                                                d.days[currDayIndex].periods[currPeriodIndex]
                                                    .groups[currGroupIndex].blocks
                                            if (blocks.length <= 0)
                                                return blocks.push({
                                                    ...data,
                                                })
                                            blocks[currBlockIndex] = {
                                                ...data,
                                            }
                                        })
                                    )
                                    const block = getCurrentObject<Block>(currentPath())
                                    if (block.type === 'event' && !block.rounds.length)
                                        setCurrentPath(`${currentPath()}.rounds.0` as Path)
                                }}
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'rounds'}>
                            <RoundForm
                                onClickNext={(data) => {
                                    const currentFormIndexes = currentForm()[2]
                                    const currGroupIndex = currentFormIndexes['groups']
                                    const currBlockIndex = currentFormIndexes['blocks']
                                    const currDayIndex = currentFormIndexes['days']
                                    const currPeriodIndex = currentFormIndexes['periods']
                                    const currRoundsIndex = currentFormIndexes['rounds']

                                    setWorksheetStore(
                                        produce((d) => {
                                            const block =
                                                d.days[currDayIndex].periods[currPeriodIndex]
                                                    .groups[currGroupIndex].blocks[currBlockIndex]

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
                                }}
                                round={getCurrentObject(currentPath()) || initialEventRoundValues}
                            />
                        </Match>
                    </Switch>
                </div>
            </div>
            <div class="paper flex flex-col gap-6 rounded-none">
                <button class="btn btn-main" onClick={handleClickFinishButton}>
                    Finalizar
                </button>
            </div>
        </>
    )
}

export default Form
