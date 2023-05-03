import { Component, For, createMemo, createSignal } from 'solid-js'

import MovementEditor from '@components/MovementEditor'
import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { IEventBlock } from '@models/block'
import { numberHelper } from '@utils/numbers'
import { addToPath } from '@utils/paths'
import { createEventRoundValues, eventTypesMap } from '@utils/worksheetInitials'

import { displayWeight, getTimeCap } from '../utils'

export interface EventBlockPreviewProps extends WorksheetPeace<IEventBlock> {}

const EventBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return (
        <div class="text-center">
            {props.item.name && <div>{props.item.name}</div>}
            {props.item.event_type !== 'not_timed' && (
                <div class="title">
                    {eventTypesMap[props.item.event_type]} {getTimeCap(props.item)}
                </div>
            )}

            <For each={props.item.rounds}>
                {(round, roundIndex) => {
                    const roundPath = createMemo(() => addToPath<IEventBlock>(props.thisPath, `rounds.${roundIndex()}`))
                    const [editOpen, setEditOpen] = createSignal(false)

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
                            {props.onAdd && props.onRemove && props.onMove && (
                                <PeaceControl
                                    onAdd={props.onAdd}
                                    onRemove={props.onRemove}
                                    onMove={props.onMove}
                                    onOpenEdit={() => setEditOpen((prev) => !prev)}
                                    item={round}
                                    thisPath={roundPath()}
                                    createInitialValues={createEventRoundValues}
                                />
                            )}

                            {round.name && <div>{round.name}</div>}
                            <div class="font-bold">{numberHelper.convertNumbers(round.repeat)}</div>

                            {props.onUpdate && editOpen() && (
                                <MovementEditor
                                    onUpdate={props.onUpdate}
                                    onClose={() => setEditOpen(false)}
                                    thisPath={roundPath()}
                                    current={round}
                                />
                            )}

                            {!editOpen() && (
                                <For each={round.movements}>
                                    {(movement) => {
                                        const weight = displayWeight(movement.weight)
                                        const reps = numberHelper.convertNumbers(movement.reps, { suffix: '' })
                                        const repsDisplay = reps && reps !== '0' ? `${reps} ` : ''
                                        const displayMovement = `${repsDisplay}${movement.name}${weight}`
                                        return (
                                            <div class="movement" classList={{ withUrl: !!movement.videoUrl }}>
                                                {movement.videoUrl ? (
                                                    <a href={movement.videoUrl} target="_new">
                                                        {displayMovement}
                                                    </a>
                                                ) : (
                                                    displayMovement
                                                )}
                                            </div>
                                        )
                                    }}
                                </For>
                            )}
                        </div>
                    )
                }}
            </For>
        </div>
    )
}

export default EventBlockPreview
