import { Component, For } from 'solid-js'
import { produce } from 'solid-js/store'

import PeaceControl from '@components/PeaceControl'
import { EventBlock } from '@models/block'
import { getTimeFromSeconds } from '@utils/time'
import {
    initialEventRoundValues,
    setCurrentPath,
    setWorksheetStore,
} from '@view/CreateNewDay/config'
import { Path } from '@view/CreateNewDay/types'
import { getRoundsDisplay } from '@view/CreateNewDay/utils'

import { eventTypesMap } from '../config'
import { displayWeight } from '../utils'

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

    const handleRemoveRound = (roundIndex: number) => {
        setWorksheetStore(
            produce((current) => {
                const block =
                    current.days[props.dayIndex].periods[props.periodIndex].groups[props.groupIndex]
                        .blocks[props.blockIndex]
                if (block.type === 'event') block.rounds.splice(roundIndex, 1)

                return current
            })
        )
        setCurrentPath(`worksheet.days.${props.dayIndex}.periods.${props.periodIndex}`)
    }

    const handleAddRound = (roundIndex: number) => {
        setWorksheetStore(
            produce((current) => {
                const block =
                    current.days[props.dayIndex].periods[props.periodIndex].groups[props.groupIndex]
                        .blocks[props.blockIndex]

                if (block.type === 'event')
                    block.rounds.splice(roundIndex, 0, initialEventRoundValues)

                return current
            })
        )
        setTimeout(() => {
            setCurrentPath(
                `worksheet.days.${props.dayIndex}.periods.${props.periodIndex}.groups.${props.groupIndex}.blocks.${props.blockIndex}.rounds.${roundIndex}`
            )
        }, 1)
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
                {eventTypesMap[props.block.event_type]} {getTimeCap()}{' '}
            </div>

            <For each={props.block.rounds}>
                {(round, roundIndex) => {
                    const rounds = getRoundsDisplay(round.repeat)
                    const roundPath = `${props.pathIndex}.rounds.${roundIndex()}` as Path

                    return (
                        <div
                            class="m-1 p-2 round hoverable"
                            classList={{
                                selected: props.currentPath === roundPath,
                                empty: !round.movements.length,
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClickPeace(roundPath)
                            }}
                        >
                            <PeaceControl
                                onClickRemove={() => handleRemoveRound(roundIndex())}
                                onClickTopAdd={() => handleAddRound(roundIndex())}
                                onClickBottomAdd={() => handleAddRound(roundIndex() + 1)}
                            />

                            {round.name && <div>{round.name}</div>}
                            <div>{rounds}</div>
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
