import { Component, For, Match, Switch, createMemo } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { EventBlock, RestBlock, TextBlock } from '@models/block'
import { Group } from '@models/day'
import { Path } from '@view/CreateNewDay/types'

import EventBlockPreview from './blocks/eventBlock'
import RestBlockPreview from './blocks/restBlock'
import TextBlockPreview from './blocks/textBlock'
import { handleAddBlock, handleAddGroup, handleRemoveBlock, handleRemoveGroup } from './utils'

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

    return (
        <For each={props.groups}>
            {(group, groupIndex) => {
                const groupPath = createMemo(
                    () => `${props.pathIndex}.groups.${groupIndex()}` as Path
                )
                return (
                    <div
                        class="group hoverable"
                        classList={{
                            selected: props.currentPath === groupPath(),
                            empty: !group.name,
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleClickPeace(groupPath())
                        }}
                    >
                        <PeaceControl
                            onClickRemove={() =>
                                handleRemoveGroup(props.dayIndex, props.periodIndex, groupIndex())
                            }
                            onClickTopAdd={() =>
                                handleAddGroup(props.dayIndex, props.periodIndex, groupIndex())
                            }
                            onClickBottomAdd={() =>
                                handleAddGroup(props.dayIndex, props.periodIndex, groupIndex() + 1)
                            }
                        />

                        <div class="title">{group.name}</div>

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
                                        {blockIndex() > 0 && <div class="block-separator"></div>}
                                        <div
                                            class="block hoverable"
                                            classList={{
                                                selected: props.currentPath === blockPath(),
                                                empty: block.type === '',
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleClickPeace(blockPath())
                                            }}
                                        >
                                            <PeaceControl
                                                onClickRemove={() =>
                                                    handleRemoveBlock(
                                                        props.dayIndex,
                                                        props.periodIndex,
                                                        groupIndex(),
                                                        blockIndex()
                                                    )
                                                }
                                                onClickTopAdd={() =>
                                                    handleAddBlock(
                                                        props.dayIndex,
                                                        props.periodIndex,
                                                        groupIndex(),
                                                        blockIndex()
                                                    )
                                                }
                                                onClickBottomAdd={() =>
                                                    handleAddBlock(
                                                        props.dayIndex,
                                                        props.periodIndex,
                                                        groupIndex(),
                                                        blockIndex() + 1
                                                    )
                                                }
                                            />
                                            {block.info && <div class="info">{block.info}</div>}
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
