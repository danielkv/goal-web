import { Component, For, JSX, Show, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import TimeInput from '@components/TimeInput'
import { IEventBlock } from '@models/block'
import { Field, Form, SubmitHandler, createForm, getValue, reset, setValue, zodForm } from '@modular-forms/solid'

import { TEventBlockForm, eventBlockFormSchema, eventTypes } from './config'

export interface BlockFormProps {
    onClickNext(data: TEventBlockForm): void
    block: IEventBlock
}

const EventBlockForm: Component<BlockFormProps> = (props) => {
    const form = createForm<TEventBlockForm>({
        validate: zodForm(eventBlockFormSchema),
        initialValues: props.block,
    })

    const memoData = createMemo(() => props.block)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

    const handleSubmit: SubmitHandler<TEventBlockForm> = (values) => {
        const newValues = { ...values, rounds: props.block.rounds || [] }
        props.onClickNext(newValues)
    }

    return (
        <Form<TEventBlockForm> of={form} name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field of={form} name="name">
                {(field) => (
                    <TextInput {...field.props} class="flex-1" label="Nome" value={field.value} error={field.error} />
                )}
            </Field>
            <div class="flex gap-6">
                <Field of={form} name="event_type">
                    {(field) => {
                        const handleInput: JSX.EventHandler<HTMLSelectElement, InputEvent> = (e) => {
                            if ((e.target as any).value === 'tabata') {
                                setValue(form, 'work', 20)
                                setValue(form, 'rest', 10)
                                setValue(form, 'numberOfRounds', 8)
                            } else if ((e.target as any).value === 'emom') {
                                setValue(form, 'each', 60)
                                setValue(form, 'numberOfRounds', 4)
                            }

                            field.props.onInput(e)
                        }
                        return (
                            <div class="flex flex-col flex-1 min-w-[100px]">
                                <label class="text-sm mb-2">Tipo de evento</label>
                                <select class="input input-full" {...field.props} onInput={handleInput}>
                                    <For each={eventTypes}>
                                        {(item) => (
                                            <option value={item.key} selected={field.value === item.key}>
                                                {item.label}
                                            </option>
                                        )}
                                    </For>
                                </select>
                            </div>
                        )
                    }}
                </Field>
                <Show when={getValue(form, 'event_type') === 'emom'}>
                    <Field of={form} name="each">
                        {(field) => (
                            <TimeInput
                                {...field.props}
                                class="flex-1"
                                label="Each"
                                value={field.value}
                                error={field.error}
                            />
                        )}
                    </Field>
                    <Field of={form} name="numberOfRounds">
                        {(field) => {
                            return (
                                <TextInput
                                    {...field.props}
                                    class="flex-1"
                                    label="Rounds"
                                    type="number"
                                    value={field.value}
                                    error={field.error}
                                />
                            )
                        }}
                    </Field>
                </Show>
                <Show when={getValue(form, 'event_type') === 'tabata'}>
                    <Field of={form} name="work">
                        {(field) => (
                            <TimeInput
                                {...field.props}
                                class="flex-1"
                                label="Work"
                                value={field.value}
                                error={field.error}
                            />
                        )}
                    </Field>
                    <Field of={form} name="rest">
                        {(field) => (
                            <TimeInput
                                {...field.props}
                                class="flex-1"
                                label="Rest"
                                value={field.value}
                                error={field.error}
                            />
                        )}
                    </Field>
                    <Field of={form} name="numberOfRounds">
                        {(field) => {
                            return (
                                <TextInput
                                    {...field.props}
                                    class="flex-1"
                                    label="Rounds"
                                    type="number"
                                    value={field.value}
                                    error={field.error}
                                />
                            )
                        }}
                    </Field>
                </Show>
                <Show when={['for_time', 'max_weight', 'amrap'].includes(getValue(form, 'event_type') as string)}>
                    <Field of={form} name="timecap">
                        {(field) => (
                            <TimeInput
                                {...field.props}
                                class="flex-1"
                                label="Timecap"
                                value={field.value}
                                error={field.error}
                            />
                        )}
                    </Field>
                </Show>
            </div>

            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default EventBlockForm
