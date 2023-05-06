import { Component, JSX, createEffect, createSignal } from 'solid-js'

import { Path } from '@interfaces/app'
import { ISection, TPeaces } from '@models/day'
import { sectionTransformer } from '@utils/transformer/section'

export interface SectionEditorProps {
    onUpdate?(path: Path, newValue: TPeaces): void
    onClose(): void
    thisPath: Path
    current: ISection
}

const SectionEditor: Component<SectionEditorProps> = (props) => {
    const [text, setText] = createSignal(sectionTransformer.toString(props.current.blocks))

    createEffect(() => {
        setText(sectionTransformer.toString(props.current.blocks))
    })

    const handleUpdate: JSX.CustomEventHandlersCamelCase<HTMLFormElement>['onSubmit'] = (e) => {
        e.preventDefault()

        const text: string = (document.querySelector('#textarea') as any).value
        if (!text) return

        const blocks = sectionTransformer.toObject(text)

        const section: ISection = {
            ...props.current,
            blocks,
        }

        props.onUpdate?.(props.thisPath, section)

        props.onClose()
    }

    return (
        <form onSubmit={handleUpdate} class="flex flex-col">
            <textarea
                id="textarea"
                class="w-[400px] bg-[transparent] text-center border-white border rounded-md"
                rows={15}
            >
                {text()}
            </textarea>
            <div class="flex  gap-3 justify-end">
                <button class="btn btn-light" onClick={props.onClose}>
                    Cancelar
                </button>
                <button type="submit" class="btn btn-main">
                    Aplicar
                </button>
            </div>
        </form>
    )
}

export default SectionEditor
