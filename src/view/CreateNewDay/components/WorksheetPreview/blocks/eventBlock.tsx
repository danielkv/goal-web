import { Component, For, createMemo } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { EventBlock } from '@models/block'
import { Path } from '@view/CreateNewDay/types'
import { getRoundsDisplay } from '@view/CreateNewDay/utils'

import { eventTypesMap } from '../config'
import { displayWeight, getTimeCap, handleAddRound, handleRemoveRound } from '../utils'

export interface EventBlockPreviewProps {
    block: EventBlock
    currentPath?: Path
    pathIndex: Path
    onClickPeace(key: Path): void

    dayIndex: number
    periodIndex: number
    groupIndex: number
    blockIndex: number
}

const EventBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    const handleClickPeace = (key: Path) => {
        props.onClickPeace(key)
    }

    return (
        <div class="text-center">
            {props.block.name && <div>{props.block.name}</div>}
            <div class="font-bold text-base bg-gray-300 px-4 py-2">
                {eventTypesMap[props.block.event_type]} {getTimeCap(props.block)}
            </div>

            <For each={props.block.rounds}>
                {(round, roundIndex) => {
                    const roundPath = createMemo(
                        () => `${props.pathIndex}.rounds.${roundIndex()}` as Path
                    )

                    return (
                        <div
                            class="m-1 p-2 round hoverable"
                            classList={{
                                selected: props.currentPath === roundPath(),
                                empty: !round.movements.length,
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClickPeace(roundPath())
                            }}
                        >
                            <PeaceControl
                                onClickRemove={() =>
                                    handleRemoveRound(
                                        props.dayIndex,
                                        props.periodIndex,
                                        props.groupIndex,
                                        props.blockIndex,
                                        roundIndex()
                                    )
                                }
                                onClickTopAdd={() =>
                                    handleAddRound(
                                        props.dayIndex,
                                        props.periodIndex,
                                        props.groupIndex,
                                        props.blockIndex,
                                        roundIndex()
                                    )
                                }
                                onClickBottomAdd={() =>
                                    handleAddRound(
                                        props.dayIndex,
                                        props.periodIndex,
                                        props.groupIndex,
                                        props.blockIndex,
                                        roundIndex() + 1
                                    )
                                }
                            />

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
