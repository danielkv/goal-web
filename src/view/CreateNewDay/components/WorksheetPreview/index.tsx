import dayjs from 'dayjs'

import { Component, For, createMemo } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { Worksheet } from '@models/day'
import { Path } from '@view/CreateNewDay/types'

import Groups from './groups'
import { handleAddDay, handleAddPeriod, handleRemoveDay, handleRemovePeriod } from './utils'

export interface WorksheetPreviewProps {
    worksheet: Worksheet
    onClickPeace(key: Path): void
    currentPath?: Path
}

const WorksheetPreview: Component<WorksheetPreviewProps> = (props) => {
    const handleClickPeace = (key: Path) => {
        props.onClickPeace(key)
    }

    return (
        <div class="worksheet">
            <h1
                class="text-xl font-bold m-2 p-2 hoverable"
                classList={{ selected: props.currentPath === 'worksheet' }}
                onClick={(e) => {
                    e.stopPropagation()
                    handleClickPeace(`worksheet`)
                }}
            >
                {props.worksheet.name} - Início:{' '}
                {dayjs(props.worksheet.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}
            </h1>
            {props.worksheet.info && <div>{props.worksheet.info}</div>}
            <For each={props.worksheet.days}>
                {(day, dayIndex) => {
                    const dayPath = createMemo<Path>(() => `worksheet.days.${dayIndex()}`)
                    return (
                        <div
                            class="day hoverable"
                            classList={{
                                selected: props.currentPath === dayPath(),
                                empty: !day.periods.length,
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClickPeace(dayPath())
                            }}
                        >
                            <PeaceControl
                                onClickRemove={() => handleRemoveDay(dayIndex())}
                                onClickTopAdd={() =>
                                    handleAddDay(dayIndex(), {
                                        date: dayjs(day.date)
                                            .subtract(1, 'day')
                                            .format('YYYY-MM-DD'),
                                        name: day.name,
                                    })
                                }
                                onClickBottomAdd={() =>
                                    handleAddDay(dayIndex() + 1, {
                                        date: dayjs(day.date).add(1, 'day').format('YYYY-MM-DD'),
                                        name: day.name,
                                    })
                                }
                            />
                            <For each={day.periods}>
                                {(period, periodIndex) => {
                                    const periodPath = createMemo<Path>(
                                        () =>
                                            `worksheet.days.${dayIndex()}.periods.${periodIndex()}`
                                    )
                                    return (
                                        <div
                                            class="period hoverable"
                                            classList={{
                                                selected: props.currentPath === periodPath(),
                                                empty: !period.groups.length,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleClickPeace(periodPath())
                                            }}
                                        >
                                            <PeaceControl
                                                onClickRemove={() =>
                                                    handleRemovePeriod(dayIndex(), periodIndex())
                                                }
                                                onClickTopAdd={() =>
                                                    handleAddPeriod(dayIndex(), periodIndex())
                                                }
                                                onClickBottomAdd={() =>
                                                    handleAddPeriod(dayIndex(), periodIndex() + 1)
                                                }
                                            />

                                            <div class="header">
                                                <div class="w-16 h-16 flex items-center justify-center bg-red-500">
                                                    {periodIndex() + 1}
                                                </div>
                                                <div class="title">
                                                    {period.name || 'WORKSHEET'}
                                                </div>
                                                <div class="text-right mr-6">
                                                    <small class="flex items-center justify-end gap-3">
                                                        <span>
                                                            {dayjs(day.date, 'YYYY-MM-DD')
                                                                .format('dddd')
                                                                .toLocaleUpperCase()}
                                                        </span>

                                                        {dayjs(day.date, 'YYYY-MM-DD').format(
                                                            'DD/MM/YYYY'
                                                        )}
                                                    </small>
                                                    <div class="font-bold">{day.name}</div>
                                                </div>
                                            </div>
                                            <div class="p-6">
                                                <Groups
                                                    dayIndex={dayIndex()}
                                                    periodIndex={periodIndex()}
                                                    groups={period.groups}
                                                    onClickPeace={handleClickPeace}
                                                    pathIndex={periodPath()}
                                                    currentPath={props.currentPath}
                                                />
                                            </div>
                                        </div>
                                    )
                                }}
                            </For>
                        </div>
                    )
                }}
            </For>
        </div>
    )
}

export default WorksheetPreview
