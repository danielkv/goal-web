import dayjs from 'dayjs'

import { Component, For, createMemo, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { Day, Period } from '@models/day'
import { addToPath, getLastIndex, pathToNextIndex } from '@utils/paths'
import { createPeriodValues } from '@utils/worksheetInitials'

import GroupPreview from './group'

export interface PeriodProps extends WorksheetPeace<Period> {
    day: Day
}

const PeriodPreview: Component<PeriodProps> = (props) => {
    const [parentProps] = splitProps(props, ['currentPath', 'onAdd', 'onRemove', 'onClickPeace'])

    return (
        <div
            class="period"
            classList={{
                selected: props.currentPath === props.thisPath,
                empty: !props.item.groups.length,
                hoverable: !!props.onClickPeace,
            }}
            onClick={(e) => {
                e.stopPropagation()
                props.onClickPeace?.(props.thisPath)
            }}
        >
            {props.onAdd && props.onRemove && (
                <PeaceControl
                    onClickRemove={() => props.onRemove?.(props.thisPath)}
                    onClickTopAdd={() => props.onAdd?.(props.thisPath, createPeriodValues())}
                    onClickBottomAdd={() =>
                        props.onAdd?.(pathToNextIndex(props.thisPath), createPeriodValues())
                    }
                />
            )}

            <div class="header">
                <div class="w-16 h-16 flex items-center justify-center bg-red-500">
                    {getLastIndex(props.thisPath) + 1}
                </div>
                <div class="title">{props.item.name || 'WORKSHEET'}</div>
                <div class="text-right mr-6">
                    <small class="flex items-center justify-end gap-3">
                        <span>
                            {dayjs(props.day.date, 'YYYY-MM-DD').format('dddd').toLocaleUpperCase()}
                        </span>

                        {dayjs(props.day.date, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                    </small>
                    <div class="font-bold">{props.day.name}</div>
                </div>
            </div>
            <div class="p-6">
                <For each={props.item.groups}>
                    {(group, groupIndex) => {
                        const groupPath = createMemo(() =>
                            addToPath<Period>(props.thisPath, `groups.${groupIndex()}`)
                        )

                        return <GroupPreview item={group} thisPath={groupPath()} {...parentProps} />
                    }}
                </For>
            </div>
        </div>
    )
}

export default PeriodPreview
