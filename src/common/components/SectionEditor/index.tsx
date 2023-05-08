import { Component, JSX, createEffect, createSignal } from 'solid-js'

import { Path } from '@interfaces/app'
import { ISection, TPeaces } from '@models/day'
import { getErrorMessage } from '@utils/errors'
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

        try {
            const text: string = (document.querySelector('#textarea') as any).value
            if (!text) return

            const blocks = sectionTransformer.toObject(text)

            const section: ISection = {
                ...props.current,
                blocks,
            }

            props.onUpdate?.(props.thisPath, section)

            props.onClose()
        } catch (err) {
            alert(getErrorMessage(err))
        }
    }

    return (
        <form onSubmit={handleUpdate} class="flex w-full flex-col">
            <textarea
                id="textarea"
                class="w-full bg-[transparent] text-center border-white border rounded-md"
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
