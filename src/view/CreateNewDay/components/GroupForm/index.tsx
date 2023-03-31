import { Component } from 'solid-js'

import TextInput from '@components/TextInput'
import { Group } from '@models/day'
import { Field, Form, SubmitHandler, createForm, zodForm } from '@modular-forms/solid'

import { TGroupForm, groupFormSchema } from './config'

export interface GroupFormProps {
    onClickNext(data: TGroupForm): void
    group: Group
}

const GroupForm: Component<GroupFormProps> = ({ onClickNext, group }) => {
    const loginForm = createForm<TGroupForm>({
        validate: zodForm(groupFormSchema),
        initialValues: group,
    })

    const handleSubmit: SubmitHandler<TGroupForm> = (values) => {
        onClickNext(values)
    }

    return (
        <Form<TGroupForm>
            of={loginForm}
            name="teste"
            class="flex flex-col gap-6"
            onSubmit={handleSubmit}
        >
            <Field of={loginForm} name="name">
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
