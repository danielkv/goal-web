import dayjs from 'dayjs'

import { Component, For, Match, Switch } from 'solid-js'

import { EventBlock, RestBlock, TextBlock } from '@models/block'
import { Worksheet } from '@models/day'
import { Path } from '@view/CreateNewDay/types'

import EventBlockPreview from './eventBlock'
import RestBlockPreview from './restBlock'
import TextBlockPreview from './textBlock'

export interface WorksheetPreviewProps {
    worksheet: Worksheet
    onClickPeace(key: Path): void
}

const WorksheetPreview: Component<WorksheetPreviewProps> = (props) => {
    const handleClickPeace = (key: Path) => {
        props.onClickPeace(key)
    }

    return (
        <div class=" flex flex-col gap-12 items-center p-6">
            <For each={props.worksheet.days}>
                {(day, dayIndex) => (
                    <div class="w-a4 min-h-a4 bg-gray-500">
                        <div
                            class="flex items-center gap-6 mb-20 hoverable"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClickPeace(`worksheet.days.${dayIndex()}`)
                            }}
                        >
                            <div class="w-16 h-16 flex items-center justify-center bg-red-500">
                                {day.period}
                            </div>
                            <div class="flex-1 text-2xl tracking-[.5em]">WORKSHEET</div>
                            <div class="text-right mr-6">
                                <div>{dayjs(day.date, 'YYYY-MM-DD').format('DD/MM/YYYY')}</div>
                                <div class="font-bold text-lg">{day.name}</div>
                            </div>
                        </div>
                        <For each={day.groups}>
                            {(group, blockIndex) => (
                                <div
                                    class="flex flex-col items-center text-xl hoverable"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleClickPeace(
                                            `worksheet.days.${dayIndex()}.groups.${blockIndex()}`
                                        )
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
                                                            `worksheet.days.${dayIndex()}.groups.${blockIndex()}.blocks.${groupIndex()}`
                                                        )
                                                    }}
                                                >
                                                    <Switch>
                                                        <Match when={block.type === 'rest'}>
                                                            <RestBlockPreview
                                                                block={block as RestBlock}
                                                            />
                                                        </Match>
                                                        <Match when={block.type === 'text'}>
                                                            <TextBlockPreview
                                                                block={block as TextBlock}
                                                            />
                                                        </Match>
                                                        <Match when={block.type === 'event'}>
                                                            <EventBlockPreview
                                                                path={`worksheet.days.${dayIndex()}.groups.${blockIndex()}.blocks.${groupIndex()}`}
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
                    </div>
                )}
            </For>
        </div>
    )
}

export default WorksheetPreview
