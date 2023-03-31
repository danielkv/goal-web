import dayjs from 'dayjs'

import { Component, For, Match, Switch } from 'solid-js'

import { EventBlock, RestBlock, TextBlock } from '@models/block'
import { Day } from '@models/day'
import { Path } from '@view/CreateNewDay/types'

import EventBlockPreview from './eventBlock'
import RestBlockPreview from './restBlock'
import TextBlockPreview from './textBlock'

export interface WorksheetPreviewProps {
    day: Day
    onClickPeace(key: Path): void
}

const WorksheetPreview: Component<WorksheetPreviewProps> = (props) => {
    const handleClickPeace = (key: Path) => {
        props.onClickPeace(key)
    }

    return (
        <>
            <div
                class="flex items-center gap-6 mb-20 hoverable"
                onClick={(e) => {
                    e.stopPropagation()
                    handleClickPeace(`day`)
                }}
            >
                <div class="w-16 h-16 flex items-center justify-center bg-red-500">
                    {props.day.period}
                </div>
                <div class="flex-1 text-2xl tracking-[.5em]">WORKSHEET</div>
                <div class="text-right mr-6">
                    <div>{dayjs(props.day.date, 'YYYY-MM-DD').format('DD/MM/YYYY')}</div>
                    <div class="font-bold text-lg">{props.day.name}</div>
                </div>
            </div>
            <For each={props.day.groups}>
                {(group, blockIndex) => (
                    <div
                        class="flex flex-col items-center text-xl hoverable"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleClickPeace(`day.groups.${blockIndex()}`)
                        }}
                    >
                        <div class="bg-red-500 px-12 min-w-[350px] py-4 text-center">
                            {group.name}
                        </div>

                        <For each={group.blocks}>
                            {(block, groupIndex) => (
                                <>
                                    {groupIndex() > 0 && (
                                        <div class="border-t-2 border-gray-500 w-20"></div>
                                    )}
                                    <div
                                        class="m-6 hoverable"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleClickPeace(
                                                `day.groups.${blockIndex()}.blocks.${groupIndex()}`
                                            )
                                        }}
                                    >
                                        <Switch>
                                            <Match when={block.type === 'rest'}>
                                                <RestBlockPreview block={block as RestBlock} />
                                            </Match>
                                            <Match when={block.type === 'text'}>
                                                <TextBlockPreview block={block as TextBlock} />
                                            </Match>
                                            <Match when={block.type === 'event'}>
                                                <EventBlockPreview
                                                    path={`day.groups.${blockIndex()}.blocks.${groupIndex()}`}
                                                    onClickPeace={handleClickPeace}
                                                    block={block as EventBlock}
                                                />
                                            </Match>
                                        </Switch>
                                    </div>
                                </>
                            )}
                        </For>
                    </div>
                )}
            </For>
        </>
    )
}

export default WorksheetPreview
