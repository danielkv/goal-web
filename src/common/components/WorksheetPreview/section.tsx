import { Component, For, createMemo, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { ISection } from '@models/day'
import { addToPath } from '@utils/paths'
import { createSectionValues } from '@utils/worksheetInitials'

import BlockPreview from './block'

export interface SectionProps extends WorksheetPeace<ISection> {}

const SectionPreview: Component<SectionProps> = (props) => {
    const [parentProps, controlProps] = splitProps(
        props,
        ['currentPath', 'onAdd', 'onRemove', 'onMove', 'onUpdate', 'onClickPeace'],
        ['onAdd', 'onRemove', 'onMove', 'item', 'thisPath']
    )

    return (
        <div
            class="section"
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
            {props.onAdd && props.onRemove && props.onMove && (
                <PeaceControl {...controlProps} createInitialValues={createSectionValues} />
            )}

            <div class="title">{props.item.name}</div>

            <For each={props.item.blocks}>
                {(block, blockIndex) => {
                    const blockPath = createMemo(() => addToPath<ISection>(props.thisPath, `blocks.${blockIndex()}`))

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

export default SectionPreview
