import dayjs from 'dayjs'

import { Component, For, createEffect, createMemo, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { Day } from '@models/day'
import { addToPath, pathToNextIndex } from '@utils/paths'
import { initialDayValues } from '@utils/worksheetInitials'

import PeriodPreview from './period'

export interface DayProps extends WorksheetPeace<Day> {}

const DayPreview: Component<DayProps> = (props) => {
    const [parentProps] = splitProps(props, ['currentPath', 'onAdd', 'onRemove', 'onClickPeace'])

    createEffect(() => {
        console.log(parentProps)
    })

    return (
        <div
            class="day"
            classList={{
                selected: props.currentPath === props.thisPath,
                empty: !props.item.periods.length,
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
                    onClickTopAdd={() =>
                        props.onAdd?.(props.thisPath, initialDayValues, {
                            date: dayjs(props.item.date).subtract(1, 'day').format('YYYY-MM-DD'),
                            name: props.item.name,
                        })
                    }
                    onClickBottomAdd={() =>
                        props.onAdd?.(pathToNextIndex(props.thisPath), initialDayValues, {
                            date: dayjs(props.item.date).add(1, 'day').format('YYYY-MM-DD'),
                            name: props.item.name,
                        })
                    }
                />
            )}

            <For each={props.item.periods}>
                {(period, periodIndex) => {
                    const periodPath = createMemo(() =>
                        addToPath<Day>(props.thisPath, `periods.${periodIndex()}`)
                    )

                    return (
                        <PeriodPreview
                            day={props.item}
                            item={period}
                            thisPath={periodPath()}
                            {...parentProps}
                        />
                    )
                }}
            </For>
        </div>
    )
}

export default DayPreview
