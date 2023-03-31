import { Component, For } from 'solid-js'

import { EventBlock } from '@models/block'

import { eventTypesMap } from './config'
import { displayWeight } from './utils'

export interface EventBlockPreviewProps {
    block: EventBlock
}
const EventBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return (
        <div class="text-center">
            {props.block.name && <div>{props.block.name}</div>}
            <div class="font-bold text-lg bg-gray-300 px-4 py-2">
                {eventTypesMap[props.block.event_type]}
            </div>

            <For each={props.block.rounds}>
                {(round) => {
                    const rounds =
                        round.repeat && round.repeat > 1 ? `${round.repeat} Rounds` : `1 Round`

                    return (
                        <div class="m-2">
                            {round.name && <div>{round.name}</div>}
                            <div>{rounds}</div>
                            <For each={round.movements}>
                                {(movement) => {
                                    const weight = displayWeight(movement.weight)
                                    const reps = movement.reps ? `${movement.reps}x ` : ''
                                    return <div>{`${reps}${movement.name}${weight}`}</div>
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
