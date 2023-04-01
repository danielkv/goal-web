import { FiTrash2 } from 'solid-icons/fi'

import { Component, For, Match, Switch } from 'solid-js'
import { produce } from 'solid-js/store'

import { EventBlock, RestBlock, TextBlock } from '@models/block'
import { Group } from '@models/day'
import { setCurrentPath, setWorksheetStore } from '@view/CreateNewDay/config'
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

    return (
        <For each={props.groups}>
            {(group, groupIndex) => {
                const groupPath = `${props.pathIndex}.groups.${groupIndex()}` as Path
                return (
                    <div
                        class="flex flex-col items-center text-xl hoverable"
                        classList={{
                            selected: props.currentPath === groupPath,
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleClickPeace(groupPath)
                        }}
                    >
                        <button class="icon-btn" onClick={() => handleRemoveGroup(groupIndex())}>
                            <FiTrash2 />
                        </button>
                        <div class="bg-red-500 px-12 min-w-[350px] py-4 text-center">
                            {group.name}
                        </div>

                        <For each={group.blocks}>
                            {(block, blockIndex) => {
                                const blockPath = `${
                                    props.pathIndex
                                }.groups.${groupIndex()}.blocks.${blockIndex()}` as Path

                                return (
                                    <>
                                        {blockIndex() > 0 && (
                                            <div class="border-t-2 border-gray-500 w-20"></div>
                                        )}
                                        <div
                                            class="m-3 p-3 hoverable"
                                            classList={{
                                                selected: props.currentPath === blockPath,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleClickPeace(blockPath)
                                            }}
                                        >
                                            <button class="icon-btn">
                                                <FiTrash2 />
                                            </button>
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
                                                        pathIndex={blockPath}
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
