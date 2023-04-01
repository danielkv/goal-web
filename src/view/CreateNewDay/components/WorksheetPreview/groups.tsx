import { Component, For, Match, Switch } from 'solid-js'

import { EventBlock, RestBlock, TextBlock } from '@models/block'
import { Group } from '@models/day'
import { Path } from '@view/CreateNewDay/types'

import EventBlockPreview from './blocks/eventBlock'
import RestBlockPreview from './blocks/restBlock'
import TextBlockPreview from './blocks/textBlock'

export interface GroupsProps {
    groups: Group[]
    pathIndex: Path
    currentPath?: Path
    onClickPeace(key: Path): void
}

const Groups: Component<GroupsProps> = (props) => {
    const handleClickPeace = (key: Path) => {
        props.onClickPeace(key)
    }

    return (
        <For each={props.groups}>
            {(group, blockIndex) => {
                const groupPath = `${props.pathIndex}.groups.${blockIndex()}` as Path
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
                        <div class="bg-red-500 px-12 min-w-[350px] py-4 text-center">
                            {group.name}
                        </div>

                        <For each={group.blocks}>
                            {(block, groupIndex) => {
                                const blockPath = `${
                                    props.pathIndex
                                }.groups.${blockIndex()}.blocks.${groupIndex()}` as Path

                                return (
                                    <>
                                        {groupIndex() > 0 && (
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
                                            <Switch>
                                                <Match when={block.type === 'rest'}>
                                                    <RestBlockPreview block={block as RestBlock} />
                                                </Match>
                                                <Match when={block.type === 'text'}>
                                                    <TextBlockPreview block={block as TextBlock} />
                                                </Match>
                                                <Match when={block.type === 'event'}>
                                                    <EventBlockPreview
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
