import { Component, For, Show, createMemo, createSignal, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import SectionEditor from '@components/SectionEditor'
import { WorksheetPeace } from '@interfaces/preview'
import { ISection } from '@models/day'
import { addToPath } from '@utils/paths'
import { createSectionValues } from '@utils/worksheetInitials'

import BlockPreview from './block'

export interface SectionProps extends WorksheetPeace<ISection> {}

const SectionPreview: Component<SectionProps> = (props) => {
    const [editorOpen, setEditorOpen] = createSignal(false)

    const [parentProps, controlProps] = splitProps(
        props,
        ['currentPath', 'onAdd', 'onRemove', 'onMove', 'onUpdate', 'onClickPeace'],
        ['onAdd', 'onRemove', 'onMove', 'item', 'thisPath']
    )

    document.addEventListener('keydown', (e) => {
        if (props.currentPath !== props.thisPath) return
        if (e.key === 'Enter') {
            e.preventDefault()
            setEditorOpen(true)
        }
    })

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
                <PeaceControl
                    {...controlProps}
                    createInitialValues={createSectionValues}
                    onOpenEdit={() => setEditorOpen((prev) => !prev)}
                />
            )}

            <div class="title">{props.item.name}</div>

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
                            <>
                                {blockIndex() > 0 && <div class="block-separator"></div>}
                                <BlockPreview item={block} thisPath={blockPath()} {...parentProps} />
                            </>
                        )
                    }}
                </For>
            </Show>
        </div>
    )
}

export default SectionPreview
