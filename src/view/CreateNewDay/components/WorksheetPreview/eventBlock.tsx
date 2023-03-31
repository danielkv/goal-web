import { Component, For } from 'solid-js'

import { EventBlock } from '@models/block'
import { Path } from '@view/CreateNewDay/types'

import { eventTypesMap } from './config'
import { displayWeight } from './utils'

export interface EventBlockPreviewProps {
    block: EventBlock
    path: Path
    onClickPeace(key: Path): void
}
const EventBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    const handleClickPeace = (key: Path) => {
        props.onClickPeace(key)
    }

    return (
        <div class="text-center">
            {props.block.name && <div>{props.block.name}</div>}
            <div class="font-bold text-lg bg-gray-300 px-4 py-2">
                {eventTypesMap[props.block.event_type]}
            </div>

            <For each={props.block.rounds}>
                {(round, roundIndex) => {
                    const rounds =
                        round.repeat && round.repeat > 1 ? `${round.repeat} Rounds` : `1 Round`

                    return (
                        <div
                            class="m-2 hoverable"
                            onClick={(e) => {
                                e.stopPropagation()
                                console.log(`${props.path}.${rounds}.${roundIndex()}`)
                                handleClickPeace(`${props.path}.rounds.${roundIndex()}` as Path)
                            }}
                        >
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
