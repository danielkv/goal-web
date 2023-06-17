import { Component, For, Show, createMemo, createSignal, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import SectionEditor from '@components/SectionEditor'
import { WorksheetPeace } from '@interfaces/preview'
import { ISection } from '@models/day'
import { addToPath } from '@utils/paths'
import { createSectionValues } from '@utils/worksheetInitials'

import BlockPreview from './block'

export interface SectionProps extends WorksheetPeace<ISection> {
    periodNumber: number
    sectionNumber: number
}

const SectionPreview: Component<SectionProps> = (props) => {
    const [editorOpen, setEditorOpen] = createSignal(false)

    const [parentProps, controlProps] = splitProps(
        props,
        ['currentPath', 'onAdd', 'onRemove', 'onMove', 'onUpdate', 'onClickPeace'],
        ['onAdd', 'onRemove', 'onMove', 'item', 'thisPath']
    )

    return (
        <div
            class="section rounded-xl p-2"
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
                <PeaceControl
                    {...controlProps}
                    createInitialValues={createSectionValues}
                    onOpenEdit={() => setEditorOpen((prev) => !prev)}
                />
            )}

            <div class="font-bold text-center text-sm mb-2 uppercase">
                {props.periodNumber}.{props.sectionNumber} {props.item.name}
            </div>

            <Show when={props.onUpdate && editorOpen()}>
                <SectionEditor
                    onUpdate={props.onUpdate}
                    onClose={() => setEditorOpen(false)}
                    thisPath={props.thisPath}
                    current={props.item}
                />
            </Show>

            <Show when={!editorOpen()}>
                <For each={props.item.blocks}>
                    {(block, blockIndex) => {
                        const blockPath = createMemo(() =>
                            addToPath<ISection>(props.thisPath, `blocks.${blockIndex()}`)
                        )

                        return (
                            <BlockPreview
                                item={block}
                                sectionNumber={props.sectionNumber}
                                blockNumber={blockIndex() + 1}
                                thisPath={blockPath()}
                                {...parentProps}
                            />
                        )
                    }}
                </For>
            </Show>
        </div>
    )
}

export default SectionPreview
