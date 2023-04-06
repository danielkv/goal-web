import { Component, Match, Setter, Switch, createMemo, createSignal } from 'solid-js'
import { SetStoreFunction, produce } from 'solid-js/store'

import Breadcrumb from '@components/Breadcrumb'
import { IBreadcrumbItem } from '@components/Breadcrumb/types'
import { Block, EventBlock } from '@models/block'
import { Day, Group, Period, Worksheet } from '@models/day'
import { saveWorksheetUseCase } from '@useCases/worksheet/saveWorksheet'
import { getErrorMessage } from '@utils/errors'
import {
    addToPath,
    buildPathSequence,
    getCurrentPeace,
    getLastIndex,
    getPeaceFromPath,
    pathToParent,
} from '@utils/paths'
import {
    createBlockValues,
    createDayValues,
    createEventRoundValues,
    createGroupValues,
    createPeriodValues,
    createWorksheetValues,
} from '@utils/worksheetInitials'
import { Path } from '@view/CreateNewDay/types'
import { getBreadcrumbLabel } from '@view/CreateNewDay/utils'

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
    const currentForm = createMemo(() => getCurrentPeace(props.currentPath))

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
                        <Match when={currentForm() === 'worksheet'}>
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
                                    createWorksheetValues
                                }
                            />
                        </Match>
                        <Match when={currentForm() === 'days'}>
                            <DayForm
                                onClickNext={(data) => {
                                    const listPath = pathToParent(props.currentPath)
                                    const lastIndex = getLastIndex(props.currentPath)

                                    props.handleSetWorksheet(
                                        produce((current) => {
                                            const days = getPeaceFromPath<Day[]>(current, listPath)

                                            if (days.length <= 0)
                                                return days.push({
                                                    ...data,
                                                    periods: [],
                                                })

                                            days[lastIndex] = {
                                                ...data,
                                                periods: days[lastIndex].periods,
                                            }
                                        })
                                    )

                                    const day = getPeaceFromPath<Day>(
                                        props.worksheet,
                                        props.currentPath
                                    )

                                    if (!day.periods.length)
                                        props.handleSetPath(
                                            addToPath<Day>(props.currentPath, `periods.0`)
                                        )
                                }}
                                day={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    createDayValues()
                                }
                            />
                        </Match>
                        <Match when={currentForm() === 'periods'}>
                            <PeriodForm
                                onClickNext={(data) => {
                                    const listPath = pathToParent(props.currentPath)
                                    const lastIndex = getLastIndex(props.currentPath)

                                    props.handleSetWorksheet(
                                        produce((current) => {
                                            const periods = getPeaceFromPath<Period[]>(
                                                current,
                                                listPath
                                            )

                                            if (periods.length <= 0)
                                                return periods.push({
                                                    ...data,
                                                    groups: [],
                                                })

                                            periods[lastIndex] = {
                                                ...data,
                                                groups: periods[lastIndex].groups,
                                            }
                                        })
                                    )

                                    const period = getPeaceFromPath<Period>(
                                        props.worksheet,
                                        props.currentPath
                                    )

                                    if (!period.groups.length)
                                        props.handleSetPath(
                                            addToPath<Day>(props.currentPath, `periods.0`)
                                        )
                                }}
                                period={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    createPeriodValues()
                                }
                            />
                        </Match>
                        <Match when={currentForm() === 'groups'}>
                            <GroupForm
                                onClickNext={(data) => {
                                    const listPath = pathToParent(props.currentPath)
                                    const lastIndex = getLastIndex(props.currentPath)

                                    props.handleSetWorksheet(
                                        produce((current) => {
                                            const groups = getPeaceFromPath<Group[]>(
                                                current,
                                                listPath
                                            )

                                            if (groups.length <= 0)
                                                return groups.push({
                                                    ...data,
                                                    blocks: [],
                                                })

                                            groups[lastIndex] = {
                                                ...data,
                                                blocks: groups[lastIndex].blocks,
                                            }
                                        })
                                    )

                                    const group = getPeaceFromPath<Group>(
                                        props.worksheet,
                                        props.currentPath
                                    )
                                    if (!group.blocks.length)
                                        props.handleSetPath(
                                            addToPath<Group>(props.currentPath, `blocks.0`)
                                        )
                                }}
                                group={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    createGroupValues
                                }
                            />
                        </Match>
                        <Match when={currentForm() === 'blocks'}>
                            <BlockForm
                                block={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    createBlockValues()
                                }
                                onClickNext={(data) => {
                                    const listPath = pathToParent(props.currentPath)
                                    const lastIndex = getLastIndex(props.currentPath)

                                    props.handleSetWorksheet(
                                        produce((current) => {
                                            const blocks = getPeaceFromPath<Block[]>(
                                                current,
                                                listPath
                                            )

                                            if (blocks.length <= 0)
                                                return blocks.push({
                                                    ...data,
                                                })

                                            blocks[lastIndex] = {
                                                ...data,
                                            }
                                        })
                                    )

                                    const block = getPeaceFromPath<Block>(
                                        props.worksheet,
                                        props.currentPath
                                    )

                                    if (block.type === 'event' && !block.rounds.length)
                                        props.handleSetPath(
                                            addToPath<Block>(props.currentPath, `rounds.0`)
                                        )
                                }}
                            />
                        </Match>
                        <Match when={currentForm() === 'rounds'}>
                            <RoundForm
                                onClickNext={(data) => {
                                    const listPath = pathToParent(props.currentPath, 2)
                                    const lastIndex = getLastIndex(props.currentPath)

                                    props.handleSetWorksheet(
                                        produce((current) => {
                                            const block = getPeaceFromPath<EventBlock>(
                                                current,
                                                listPath
                                            )

                                            if (block.rounds.length <= 0)
                                                return block.rounds.push({
                                                    ...data,
                                                })

                                            block.rounds[lastIndex] = {
                                                ...data,
                                            }
                                        })
                                    )
                                }}
                                round={
                                    getPeaceFromPath(props.worksheet, props.currentPath) ||
                                    createEventRoundValues()
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
