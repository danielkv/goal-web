import { Component, For, Show, createMemo } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { IEventBlock } from '@models/block'
import { addToPath } from '@utils/paths'
import { eventBlockTransformer } from '@utils/transformer/eventblock'
import { movementTransformer } from '@utils/transformer/movement'
import { roundTransformer } from '@utils/transformer/round'
import { createEventRoundValues } from '@utils/worksheetInitials'

export interface EventBlockPreviewProps extends WorksheetPeace<IEventBlock> {}

const EventBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    const eventTitle = createMemo(() => eventBlockTransformer.displayTitle(props.item))

    return (
        <div class="text-center">
            {props.item.name && <div>{props.item.name}</div>}
            <Show when={!!eventTitle()}>
                <div class="title">{eventTitle()}</div>
            </Show>

            <For each={props.item.rounds}>
                {(round, roundIndex) => {
                    const roundPath = createMemo(() => addToPath<IEventBlock>(props.thisPath, `rounds.${roundIndex()}`))

                    const matchSequenceReps = createMemo(() => roundTransformer.findSequenceReps(round.movements))

                    const roundTitle = createMemo(() =>
                        roundTransformer.displayTitle(round, matchSequenceReps()?.join('-'))
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
                            {props.onAdd && props.onRemove && props.onMove && (
                                <PeaceControl
                                    onAdd={props.onAdd}
                                    onRemove={props.onRemove}
                                    onMove={props.onMove}
                                    item={round}
                                    thisPath={roundPath()}
                                    createInitialValues={createEventRoundValues}
                                />
                            )}
                            <Show when={!!roundTitle()}>
                                <div class="title">{roundTitle()}</div>
                            </Show>

                            <Show when={round.type == 'rest'}>{roundTransformer.displayRestRound(round)}</Show>
                            <Show when={round.type == 'complex'}>
                                <div class="movement">{roundTransformer.displayComplex(round)}</div>
                            </Show>
                            <Show when={!['rest', 'complex'].includes(round.type)}>
                                <For each={round.movements}>
                                    {(movement) => {
                                        const displayMovement = movementTransformer.display(
                                            movement,
                                            !!matchSequenceReps()
                                        )

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
                            </Show>
                        </div>
                    )
                }}
            </For>
        </div>
    )
}

export default EventBlockPreview
