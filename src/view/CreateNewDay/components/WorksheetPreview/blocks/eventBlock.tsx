import { Component, For } from 'solid-js'

import { EventBlock } from '@models/block'
import { getTimeFromSeconds } from '@utils/time'
import { Path } from '@view/CreateNewDay/types'

import { eventTypesMap } from '../config'
import { displayWeight } from '../utils'

export interface EventBlockPreviewProps {
    block: EventBlock
    currentPath?: Path
    pathIndex: Path
    onClickPeace(key: Path): void
}
const EventBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    const handleClickPeace = (key: Path) => {
        props.onClickPeace(key)
    }

    const getTimeCap = () => {
        if (props.block.event_type === 'emom') {
            const each = getTimeFromSeconds(props.block.each)
            const forTime = getTimeFromSeconds(props.block.for)
            return ` - Cada ${each} por ${forTime}`
        }

        const timecap = getTimeFromSeconds(props.block.timecap)
        return ` - ${timecap}`
    }

    return (
        <div class="text-center">
            {props.block.name && <div>{props.block.name}</div>}
            <div class="font-bold text-base bg-gray-300 px-4 py-2">
                {eventTypesMap[props.block.event_type]} {getTimeCap()}
            </div>

            <For each={props.block.rounds}>
                {(round, roundIndex) => {
                    const rounds =
                        round.repeat && round.repeat > 1 ? `${round.repeat} Rounds` : `1 Round`
                    const roundPath = `${props.pathIndex}.rounds.${roundIndex()}` as Path

                    return (
                        <div
                            class="m-1 p-2 hoverable"
                            classList={{ selected: props.currentPath === roundPath }}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClickPeace(roundPath)
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
