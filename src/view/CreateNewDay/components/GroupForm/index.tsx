import { Component } from 'solid-js'
import { createForm, Field, Form, zodForm, SubmitHandler } from '@modular-forms/solid'
import { groupInitialValues, groupFormSchema, TGroupForm } from './config'
import TextInput from '../../../../common/components/TextInput'

export interface GroupFormProps {
    onClickNext(data: TGroupForm): void
}

const GroupForm: Component<GroupFormProps> = ({ onClickNext }) => {
    const loginForm = createForm<TGroupForm>({
        validate: zodForm(groupFormSchema),
        initialValues: groupInitialValues,
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
                Adicionar 1 bloco
            </button>
        </Form>
    )
}

export default GroupForm
