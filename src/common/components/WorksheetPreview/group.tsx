import { Component, For, createMemo, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { Group } from '@models/day'
import { addToPath } from '@utils/paths'
import { createGroupValues } from '@utils/worksheetInitials'

import BlockPreview from './block'

export interface GroupProps extends WorksheetPeace<Group> {}

const GroupPreview: Component<GroupProps> = (props) => {
    const [parentProps] = splitProps(props, ['currentPath', 'onAdd', 'onRemove', 'onClickPeace'])

    return (
        <div
            class="group"
            classList={{
                selected: props.currentPath === props.thisPath,
                empty: !props.item.name,
                hoverable: !!props.onClickPeace,
            }}
            onClick={(e) => {
                e.stopPropagation()
                props.onClickPeace?.(props.thisPath)
            }}
        >
            {props.onAdd && props.onRemove && (
                <PeaceControl
                    onAdd={props.onAdd}
                    onRemove={props.onRemove}
                    item={props.item}
                    thisPath={props.thisPath}
                    createInitialValues={createGroupValues}
                />
            )}

            <div class="title">{props.item.name}</div>

            <For each={props.item.blocks}>
                {(block, blockIndex) => {
                    const blockPath = createMemo(() =>
                        addToPath<Group>(props.thisPath, `blocks.${blockIndex()}`)
                    )

                    return (
                        <>
                            {blockIndex() > 0 && <div class="block-separator"></div>}
                            <BlockPreview item={block} thisPath={blockPath()} {...parentProps} />
                        </>
                    )
                }}
            </For>
        </div>
    )
}

export default GroupPreview
