import { Component, For, Match, Switch } from 'solid-js'

import { Block } from '@models/block'
import { Field, Form, SubmitHandler, createForm, getValue, zodForm } from '@modular-forms/solid'

import EventBlockForm from './EventBlockForm'
import RestBlockForm from './RestBlockForm'
import TextBlockForm from './TextBlockForm'
import { TBlockForm, blockBlockFormSchema, blockTypes } from './config'

export interface BlockFormProps {
    onClickNext(data: TBlockForm): void
    block: Block
}

const BlockForm: Component<BlockFormProps> = ({ onClickNext, block }) => {
    const form = createForm<TBlockForm>({
        validate: zodForm(blockBlockFormSchema),
        initialValues: block,
        validateOn: 'submit',
    })

    const handleSubmit: SubmitHandler<TBlockForm> = (values) => {
        onClickNext(values)
    }

    return (
        <Form<TBlockForm>
            of={form}
            name="teste"
            class="flex flex-col gap-6"
            onSubmit={handleSubmit}
        >
            <Field of={form} name="type">
                {(field) => (
                    <select class="input input-full" {...field.props}>
                        <For each={blockTypes}>
                            {(item) => (
                                <option value={item.key} selected={field.value === item.key}>
                                    {item.label}
                                </option>
                            )}
                        </For>
                    </select>
                )}
            </Field>

            <Switch>
                <Match when={getValue(form, 'type') === 'event'}>
                    <EventBlockForm onClickNext={() => {}} />
                </Match>
                <Match when={getValue(form, 'type') === 'rest'}>
                    <RestBlockForm onClickNext={() => {}} />
                </Match>
                <Match when={getValue(form, 'type') === 'text'}>
                    <TextBlockForm onClickNext={() => {}} />
                </Match>
            </Switch>
        </Form>
    )
}

export default BlockForm
