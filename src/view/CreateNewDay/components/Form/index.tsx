import { Component, Match, Setter, Switch, createMemo, createSignal } from 'solid-js'
import { SetStoreFunction, produce } from 'solid-js/store'

import Breadcrumb from '@components/Breadcrumb'
import { IBreadcrumbItem } from '@components/Breadcrumb/types'
import { IBlock, IEventBlock } from '@models/block'
import { IDay, IPeriod, ISection, IWorksheet } from '@models/day'
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
    createPeriodValues,
    createSectionValues,
    createWorksheetValues,
} from '@utils/worksheetInitials'
import { Path } from '@view/CreateNewDay/types'
import { getBreadcrumbLabel } from '@view/CreateNewDay/utils'

import BlockForm from '../BlockForm'
import DayForm from '../DayForm'
import PeriodForm from '../PeriodForm'
import RoundForm from '../RoundForm'
import SectionForm from '../SectionForm'
import WorksheetForm from '../WorksheetForm'

export interface FormProps {
    worksheet: IWorksheet
    currentPath: Path
    handleSetPath: Setter<Path>
    handleSetWorksheet: SetStoreFunction<IWorksheet>
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
                    <Breadcrumb onClick={(key) => props.handleSetPath(key as Path)} items={breadcrumbItems()} />

                    <Switch>
                        <Match when={currentForm() === 'worksheet'}>
                            <WorksheetForm
                                onClickNext={(data) => {
                                    props.handleSetWorksheet({
                                        ...data,
                                        days: props.worksheet.days || [],
                                    })

                                    if (!props.worksheet.days.length) props.handleSetPath(`worksheet.days.0`)
                                }}
                                worksheet={
                                    getPeaceFromPath(props.worksheet, props.currentPath) || createWorksheetValues
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
                                            const days = getPeaceFromPath<IDay[]>(current, listPath)

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

                                    const day = getPeaceFromPath<IDay>(props.worksheet, props.currentPath)

                                    if (!day.periods.length)
                                        props.handleSetPath(addToPath<IDay>(props.currentPath, `periods.0`))
                                }}
                                day={getPeaceFromPath(props.worksheet, props.currentPath) || createDayValues()}
                            />
                        </Match>
                        <Match when={currentForm() === 'periods'}>
                            <PeriodForm
                                onClickNext={(data) => {
                                    const listPath = pathToParent(props.currentPath)
                                    const lastIndex = getLastIndex(props.currentPath)

                                    props.handleSetWorksheet(
                                        produce((current) => {
                                            const periods = getPeaceFromPath<IPeriod[]>(current, listPath)

                                            if (periods.length <= 0)
                                                return periods.push({
                                                    ...data,
                                                    sections: [],
                                                })

                                            periods[lastIndex] = {
                                                ...data,
                                                sections: periods[lastIndex].sections,
                                            }
                                        })
                                    )

                                    const period = getPeaceFromPath<IPeriod>(props.worksheet, props.currentPath)

                                    if (!period.sections.length)
                                        props.handleSetPath(addToPath<IPeriod>(props.currentPath, `sections.0`))
                                }}
                                period={getPeaceFromPath(props.worksheet, props.currentPath) || createPeriodValues()}
                            />
                        </Match>
                        <Match when={currentForm() === 'sections'}>
                            <SectionForm
                                onClickNext={(data) => {
                                    const listPath = pathToParent(props.currentPath)
                                    const lastIndex = getLastIndex(props.currentPath)

                                    props.handleSetWorksheet(
                                        produce((current) => {
                                            const sections = getPeaceFromPath<ISection[]>(current, listPath)

                                            if (sections.length <= 0)
                                                return sections.push({
                                                    ...data,
                                                    blocks: [],
                                                })

                                            sections[lastIndex] = {
                                                ...data,
                                                blocks: sections[lastIndex].blocks,
                                            }
                                        })
                                    )

                                    const section = getPeaceFromPath<ISection>(props.worksheet, props.currentPath)
                                    if (!section.blocks.length)
                                        props.handleSetPath(addToPath<ISection>(props.currentPath, `blocks.0`))
                                }}
                                section={getPeaceFromPath(props.worksheet, props.currentPath) || createSectionValues()}
                            />
                        </Match>
                        <Match when={currentForm() === 'blocks'}>
                            <BlockForm
                                block={getPeaceFromPath(props.worksheet, props.currentPath) || createBlockValues()}
                                onClickNext={(data) => {
                                    const listPath = pathToParent(props.currentPath)
                                    const lastIndex = getLastIndex(props.currentPath)

                                    props.handleSetWorksheet(
                                        produce((current) => {
                                            const blocks = getPeaceFromPath<IBlock[]>(current, listPath)

                                            if (blocks.length <= 0)
                                                return blocks.push({
                                                    ...data,
                                                })

                                            blocks[lastIndex] = {
                                                ...data,
                                            }
                                        })
                                    )

                                    const block = getPeaceFromPath<IBlock>(props.worksheet, props.currentPath)

                                    if (block.type === 'event' && !block.rounds.length)
                                        props.handleSetPath(addToPath<IBlock>(props.currentPath, `rounds.0`))
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
                                            const block = getPeaceFromPath<IEventBlock>(current, listPath)

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
                                round={getPeaceFromPath(props.worksheet, props.currentPath) || createEventRoundValues()}
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
