import { Component, For, createMemo } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { EventBlock } from '@models/block'
import { addToPath } from '@utils/paths'
import { createEventRoundValues, eventTypesMap } from '@utils/worksheetInitials'

import { displayWeight, getRoundsDisplay, getTimeCap } from '../utils'

export interface EventBlockPreviewProps extends WorksheetPeace<EventBlock> {}

const EventBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return (
        <div class="text-center">
            {props.item.name && <div>{props.item.name}</div>}
            <div class="font-bold text-base bg-gray-300 px-4 py-2">
                {eventTypesMap[props.item.event_type]} {getTimeCap(props.item)}
            </div>

            <For each={props.item.rounds}>
                {(round, roundIndex) => {
                    const roundPath = createMemo(() =>
                        addToPath<EventBlock>(props.thisPath, `rounds.${roundIndex()}`)
                    )

                    return (
                        <div
                            class="m-1 p-2 round"
                            classList={{
                                selected: props.currentPath === roundPath(),
                                empty: !round.movements.length,
                                hoverable: !!props.onClickPeace,
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                                props.onClickPeace?.(roundPath())
                            }}
                        >
                            {props.onAdd && props.onRemove && (
                                <PeaceControl
                                    onAdd={props.onAdd}
                                    onRemove={props.onRemove}
                                    item={round}
                                    thisPath={props.thisPath}
                                    createInitialValues={createEventRoundValues}
                                />
                            )}

                            {round.name && <div>{round.name}</div>}
                            <div>{getRoundsDisplay(round.repeat)}</div>
                            <For each={round.movements}>
                                {(movement) => {
                                    const weight = displayWeight(movement.weight)
                                    const reps = getRoundsDisplay(movement.reps)
                                    const repsDisplay = reps && reps !== '0' ? `${reps} ` : ''
                                    return <div>{`${repsDisplay}${movement.name}${weight}`}</div>
                                }}
                            </For>
                        </div>
                    )
                }}
            </For>
        </div>
    )
}

export default EventBlockPreview
