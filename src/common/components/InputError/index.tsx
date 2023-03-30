import { JSX, ParentComponent, Show } from 'solid-js'

export interface InputErrorProps {
    error?: string
    class?: JSX.HTMLAttributes<HTMLDivElement>['class']
}

const InputError: ParentComponent<InputErrorProps> = ({ error, children, class: _class }) => {
    return (
        <div class={_class}>
            {children}
            <Show when={!!error}>
                <div class="text-red-300">{error}</div>
            </Show>
        </div>
    )
}

export default InputError
