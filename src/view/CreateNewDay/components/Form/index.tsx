import { Component, Match, Setter, Switch, createMemo, createSignal } from 'solid-js'
import { SetStoreFunction, produce } from 'solid-js/store'

import Breadcrumb from '@components/Breadcrumb'
import { IBreadcrumbItem } from '@components/Breadcrumb/types'
import { Block } from '@models/block'
import { Day, Group, Period, Worksheet } from '@models/day'
import { saveWorksheetUseCase } from '@useCases/worksheet/saveWorksheet'
import { getErrorMessage } from '@utils/errors'
import { buildPathSequence, getPeaceFromPath } from '@utils/paths'
import {
    initialBlockValues,
    initialDayValues,
    initialEventRoundValues,
    initialGroupValues,
    initialPeriodValues,
    initialWorksheetValues,
} from '@utils/worksheetInitials'
import { Path } from '@view/CreateNewDay/types'
import { getBreadcrumbLabel, getCurrentForm } from '@view/CreateNewDay/utils'

import BlockForm from '../BlockForm'
import DayForm from '../DayForm'
import GroupForm from '../GroupForm'
import PeriodForm from '../PeriodForm'
import RoundForm from '../RoundForm'
import WorksheetForm from '../WorksheetForm'

export interface FormProps {
    worksheet: Worksheet
    currentPath: Path
    handleSetPath: Setter<Path>
    handleSetWorksheet: SetStoreFunction<Worksheet>
}

const Form: Component<FormProps> = (props) => {
    const [saving, setSaving] = createSignal(false)
    const currentForm = createMemo(() => getCurrentForm(props.currentPath))

    const breadcrumbItems = createMemo<IBreadcrumbItem[]>(() => {
        const sequence = buildPathSequence(props.currentPath)

        return sequence.map((item, treeIndex) => {
            const label = getBreadcrumbLabel(props.worksheet, item)

            return {
                key: item,
                label,
                buttonDisabled: treeIndex + 1 >= sequence.length,
            }
        })
    })

    const handleClickFinishButton = async () => {
        try {
            setSaving(true)
            const result = await saveWorksheetUseCase(props.worksheet)

            props.handleSetWorksheet(result)
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <div class="flex flex-1 flex-col overflow-auto">
                <div class="flex flex-col p-8 gap-4">
                    <Breadcrumb
                        onClick={(key) => props.handleSetPath(key as Path)}
                        items={breadcrumbItems()}
                    />

                    <Switch>
                        <Match when={currentForm()[0] === 'worksheet'}>
                            <WorksheetForm
                                onClickNext={(data) => {
                                    props.handleSetWorksheet({
                                        ...data,
                                        days: props.worksheet.days || [],
                                    })

                                    if (!props.worksheet.days.length)
                                        props.handleSetPath(`worksheet.days.0`)
                                }}
                                worksheet={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    initialWorksheetValues
                                }
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'days'}>
                            <DayForm
                                onClickNext={(data) => {
                                    const currDayIndex = currentForm()[2]['days']

                                    props.handleSetWorksheet(
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

                                    const day = getPeaceFromPath<Day>(
                                        props.worksheet,
                                        props.currentPath
                                    )
                                    if (!day.periods.length)
                                        props.handleSetPath(
                                            `worksheet.days.${currDayIndex}.periods.0`
                                        )
                                }}
                                day={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    initialDayValues
                                }
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'periods'}>
                            <PeriodForm
                                onClickNext={(data) => {
                                    const currentFormIndexes = currentForm()[2]
                                    const currDayIndex = currentFormIndexes['days']
                                    const currPeriodIndex = currentFormIndexes['periods']

                                    props.handleSetWorksheet(
                                        produce((d) => {
                                            const periods = d.days[currDayIndex].periods
                                            if (periods.length <= 0)
                                                return periods.push({
                                                    ...data,
                                                    groups: [],
                                                })

                                            periods[currPeriodIndex] = {
                                                ...data,
                                                groups: periods[currPeriodIndex].groups,
                                            }
                                        })
                                    )
                                    const period = getPeaceFromPath<Period>(
                                        props.worksheet,
                                        props.currentPath
                                    )
                                    if (!period.groups.length)
                                        props.handleSetPath(
                                            `worksheet.days.${currDayIndex}.periods.${currPeriodIndex}.groups.0`
                                        )
                                }}
                                period={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    initialPeriodValues
                                }
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'groups'}>
                            <GroupForm
                                onClickNext={(data) => {
                                    const currGroupIndex = currentForm()[2]['groups']
                                    const currDayIndex = currentForm()[2]['days']
                                    const currPeriodIndex = currentForm()[2]['periods']

                                    props.handleSetWorksheet(
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
                                    const group = getPeaceFromPath<Group>(
                                        props.worksheet,
                                        props.currentPath
                                    )
                                    if (!group.blocks.length)
                                        props.handleSetPath(`${props.currentPath}.blocks.0` as Path)
                                }}
                                group={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    initialGroupValues
                                }
                            />
                        </Match>
                        <Match when={currentForm()[0] === 'blocks'}>
                            <BlockForm
                                block={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    initialBlockValues
                                }
                                onClickNext={(data) => {
                                    const currentFormIndexes = currentForm()[2]
                                    const currGroupIndex = currentFormIndexes['groups']
                                    const currBlockIndex = currentFormIndexes['blocks']
                                    const currDayIndex = currentFormIndexes['days']
                                    const currPeriodIndex = currentFormIndexes['periods']

                                    props.handleSetWorksheet(
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
                                    const block = getPeaceFromPath<Block>(
                                        props.worksheet,
                                        props.currentPath
                                    )
                                    if (block.type === 'event' && !block.rounds.length)
                                        props.handleSetPath(`${props.currentPath}.rounds.0` as Path)
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

                                    props.handleSetWorksheet(
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
                                round={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    initialEventRoundValues
                                }
                            />
                        </Match>
                    </Switch>
                </div>
            </div>
            <div class="paper flex flex-col gap-6 rounded-none">
                <button class="btn btn-main" disabled={saving()} onClick={handleClickFinishButton}>
                    {saving() ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </>
    )
}

export default Form
