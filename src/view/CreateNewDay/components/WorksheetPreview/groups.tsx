import { Component, For, Match, Switch, createMemo } from 'solid-js'
import { produce } from 'solid-js/store'

import PeaceControl from '@components/PeaceControl'
import { EventBlock, RestBlock, TextBlock } from '@models/block'
import { Group } from '@models/day'
import {
    initialBlockValues,
    initialGroupValues,
    setCurrentPath,
    setWorksheetStore,
} from '@view/CreateNewDay/config'
import { Path } from '@view/CreateNewDay/types'

import EventBlockPreview from './blocks/eventBlock'
import RestBlockPreview from './blocks/restBlock'
import TextBlockPreview from './blocks/textBlock'

export interface GroupsProps {
    groups: Group[]
    pathIndex: Path
    currentPath?: Path
    onClickPeace(key: Path): void

    dayIndex: number
    periodIndex: number
}

const Groups: Component<GroupsProps> = (props) => {
    const handleClickPeace = (key: Path) => {
        props.onClickPeace(key)
    }

    const handleRemoveGroup = (groupIndex: number) => {
        setWorksheetStore(
            produce((current) => {
                current.days[props.dayIndex].periods[props.periodIndex].groups.splice(groupIndex, 1)

                return current
            })
        )
        setCurrentPath(`worksheet.days.${props.dayIndex}.periods.${props.periodIndex}`)
    }

    const handleAddGroup = (groupIndex: number) => {
        setWorksheetStore(
            produce((current) => {
                current.days[props.dayIndex].periods[props.periodIndex].groups.splice(
                    groupIndex,
                    0,
                    initialGroupValues
                )

                return current
            })
        )
        setTimeout(() => {
            setCurrentPath(
                `worksheet.days.${props.dayIndex}.periods.${props.periodIndex}.groups.${groupIndex}`
            )
        }, 1)
    }

    const handleRemoveBlock = (groupIndex: number, blockIndex: number) => {
        setWorksheetStore(
            produce((current) => {
                current.days[props.dayIndex].periods[props.periodIndex].groups[
                    groupIndex
                ].blocks.splice(blockIndex, 1)

                return current
            })
        )
        setCurrentPath(
            `worksheet.days.${props.dayIndex}.periods.${props.periodIndex}.groups.${groupIndex}`
        )
    }

    const handleAddBlock = (groupIndex: number, blockIndex: number) => {
        setWorksheetStore(
            produce((current) => {
                current.days[props.dayIndex].periods[props.periodIndex].groups[
                    groupIndex
                ].blocks.splice(blockIndex, 0, initialBlockValues)

                return current
            })
        )
        setTimeout(() => {
            setCurrentPath(
                `worksheet.days.${props.dayIndex}.periods.${props.periodIndex}.groups.${groupIndex}.blocks.${blockIndex}`
            )
        }, 1)
    }

    return (
        <For each={props.groups}>
            {(group, groupIndex) => {
                const groupPath = createMemo(
                    () => `${props.pathIndex}.groups.${groupIndex()}` as Path
                )
                return (
                    <div
                        class="flex flex-col items-center text-xl hoverable"
                        classList={{
                            selected: props.currentPath === groupPath(),
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleClickPeace(groupPath())
                        }}
                    >
                        <PeaceControl
                            onClickRemove={() => handleRemoveGroup(groupIndex())}
                            onClickTopAdd={() => handleAddGroup(groupIndex())}
                            onClickBottomAdd={() => handleAddGroup(groupIndex() + 1)}
                        />

                        <div class="bg-red-500 px-12 min-w-[350px] py-4 text-center">
                            {group.name}
                        </div>

                        <For each={group.blocks}>
                            {(block, blockIndex) => {
                                const blockPath = createMemo(
                                    () =>
                                        `${
                                            props.pathIndex
                                        }.groups.${groupIndex()}.blocks.${blockIndex()}` as Path
                                )

                                return (
                                    <>
                                        {blockIndex() > 0 && (
                                            <div class="border-t-2 border-gray-500 w-20"></div>
                                        )}
                                        <div
                                            class="m-3 p-3 hoverable"
                                            classList={{
                                                selected: props.currentPath === blockPath(),
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleClickPeace(blockPath())
                                            }}
                                        >
                                            <PeaceControl
                                                onClickRemove={() =>
                                                    handleRemoveBlock(groupIndex(), blockIndex())
                                                }
                                                onClickTopAdd={() =>
                                                    handleAddBlock(groupIndex(), blockIndex())
                                                }
                                                onClickBottomAdd={() =>
                                                    handleAddBlock(groupIndex(), blockIndex() + 1)
                                                }
                                            />
                                            <Switch>
                                                <Match when={block.type === 'rest'}>
                                                    <RestBlockPreview block={block as RestBlock} />
                                                </Match>
                                                <Match when={block.type === 'text'}>
                                                    <TextBlockPreview block={block as TextBlock} />
                                                </Match>
                                                <Match when={block.type === 'event'}>
                                                    <EventBlockPreview
                                                        dayIndex={props.dayIndex}
                                                        periodIndex={props.periodIndex}
                                                        groupIndex={groupIndex()}
                                                        blockIndex={blockIndex()}
                                                        currentPath={props.currentPath}
                                                        pathIndex={blockPath()}
                                                        onClickPeace={handleClickPeace}
                                                        block={block as EventBlock}
                                                    />
                                                </Match>
                                            </Switch>
                                        </div>
                                    </>
                                )
                            }}
                        </For>
                    </div>
                )
            }}
        </For>
    )
}

export default Groups
