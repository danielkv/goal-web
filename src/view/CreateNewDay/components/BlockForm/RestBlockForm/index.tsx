import { Component, JSX, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import { RestBlock } from '@models/block'
import { Field, Form, SubmitHandler, createForm, reset, setValue, zodForm } from '@modular-forms/solid'
import { secondsToStringTime, stringTimeToSeconds } from '@utils/time'

import { TRestBlockForm, restBlockFormSchema } from './config'

export interface RestBlockFormProps {
    onClickNext(data: TRestBlockForm): void
    block: RestBlock
}

const RestBlockForm: Component<RestBlockFormProps> = (props) => {
    const form = createForm<TRestBlockForm>({
        validate: zodForm(restBlockFormSchema),
        initialValues: props.block,
    })

    const memoData = createMemo(() => props.block)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

    const handleSubmit: SubmitHandler<TRestBlockForm> = (values) => {
        props.onClickNext(values)
    }

    return (
        <Form<TRestBlockForm> of={form} name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field of={form} name="time">
                {(field) => {
                    const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
                        const seconds = stringTimeToSeconds((e.target as any).value)
                        setValue(form, 'time', seconds)
                    }
                    return (
                        <TextInput
                            {...field.props}
                            onInput={handleInput}
                            class="flex-1"
                            label="Tempo"
                            type="time"
                            value={secondsToStringTime(field.value || 0)}
                            error={field.error}
                        />
                    )
                }}
            </Field>

            <Field of={form} name="text">
                {(field) => (
                    <TextInput {...field.props} class="flex-1" label="Texto" value={field.value} error={field.error} />
                )}
            </Field>

            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default RestBlockForm
