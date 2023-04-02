import { Component } from 'solid-js'

import TextInput from '@components/TextInput'
import { Group } from '@models/day'
import { Field, Form, SubmitHandler, createForm, zodForm } from '@modular-forms/solid'

import { TGroupForm, groupFormSchema } from './config'

export interface GroupFormProps {
    onClickNext(data: TGroupForm): void
    group: Group
}

const GroupForm: Component<GroupFormProps> = (props) => {
    const form = createForm<TGroupForm>({
        validate: zodForm(groupFormSchema),
        initialValues: props.group,
    })

    const handleSubmit: SubmitHandler<TGroupForm> = (values) => {
        props.onClickNext(values)
    }

    return (
        <Form<TGroupForm>
            of={form}
            name="teste"
            class="flex flex-col gap-4"
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
            <button class="btn btn-main self-end" type="submit">
                Confirmar
            </button>
        </Form>
    )
}

export default GroupForm
