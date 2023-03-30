import { Component, For, Show } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, Form, SubmitHandler, createForm, getValue, zodForm } from '@modular-forms/solid'

import {
    TEventBlockForm,
    eventBlockFormSchema,
    eventBlockInitialValues,
    eventTypes,
} from './config'

export interface BlockFormProps {
    onClickNext(data: TEventBlockForm): void
}

const EventBlockForm: Component<BlockFormProps> = ({ onClickNext }) => {
    const form = createForm<TEventBlockForm>({
        validate: zodForm(eventBlockFormSchema),
        initialValues: eventBlockInitialValues,
        validateOn: 'submit',
    })

    const handleSubmit: SubmitHandler<TEventBlockForm> = (values) => {
        onClickNext(values)
    }

    return (
        <Form<TEventBlockForm>
            of={form}
            name="teste"
            class="flex flex-col gap-6"
            onSubmit={handleSubmit}
        >
            <Field of={form} name="name">
                {(field) => (
                    <TextInput
                        class="flex-1"
                        label="Nome"
                        value={field.value}
                        error={field.error}
                        {...field.props}
                    />
                )}
            </Field>
            <div class="flex gap-6">
                <Field of={form} name="event_type">
                    {(field) => (
                        <select class="input w-40" {...field.props}>
                            <For each={eventTypes}>
                                {(item) => (
                                    <option value={item.key} selected={field.value === item.key}>
                                        {item.label}
                                    </option>
                                )}
                            </For>
                        </select>
                    )}
                </Field>
                <Show when={getValue(form, 'event_type') === 'emom'}>
                    <Field of={form} name="each">
                        {(field) => (
                            <TextInput
                                class="flex-1"
                                label="Cada (seg)"
                                type="number"
                                value={field.value}
                                error={field.error}
                                {...field.props}
                            />
                        )}
                    </Field>
                    <Field of={form} name="for">
                        {(field) => (
                            <TextInput
                                class="flex-1"
                                label="Por (seg)"
                                type="number"
                                value={field.value}
                                error={field.error}
                                {...field.props}
                            />
                        )}
                    </Field>
                </Show>
                <Show when={getValue(form, 'event_type') !== 'emom'}>
                    <Field of={form} name="timecap">
                        {(field) => (
                            <TextInput
                                class="flex-1"
                                label="Timecap"
                                type="number"
                                value={field.value}
                                error={field.error}
                                {...field.props}
                            />
                        )}
                    </Field>
                </Show>
            </div>

            <button class="btn btn-main self-end" type="submit">
                Confirmar
            </button>
        </Form>
    )
}

export default EventBlockForm
