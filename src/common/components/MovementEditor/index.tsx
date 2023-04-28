import { Component, createEffect, createSignal } from 'solid-js'

import { Path } from '@interfaces/app'
import { IEventRound } from '@models/block'
import { TPeaces } from '@models/day'
import { movementsToText, textToMovements } from '@utils/worksheet'

export interface MovementEditorProps {
    onUpdate(path: Path, newValue: TPeaces): void
    onClose(): void
    thisPath: Path
    current: IEventRound
}

const MovementEditor: Component<MovementEditorProps> = (props) => {
    const [text, setText] = createSignal(movementsToText(props.current.movements))

    createEffect(() => {
        setText(movementsToText(props.current.movements))
    })

    function handleUpdate() {
        const text: string = (document.querySelector('#textarea') as any).value
        if (!text) return

        const movements = textToMovements(text)

        props.onUpdate?.(props.thisPath, { ...props.current, movements })

        props.onClose()
    }

    return (
        <form onSubmit={handleUpdate} class="flex flex-col">
            <textarea
                id="textarea"
                class="w-[400px] bg-[transparent] text-center border-white border rounded-md"
                rows={5}
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

export default MovementEditor
