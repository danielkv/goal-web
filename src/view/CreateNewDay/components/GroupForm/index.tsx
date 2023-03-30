import { Component } from 'solid-js'
import { createForm, Field, Form, zodForm, SubmitHandler } from '@modular-forms/solid'
import { groupInitialValues, groupFormSchema, TGroupForm } from './config'
import InputError from '../../../../common/components/InputError'

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
                {({ error, props, value }) => (
                    <InputError class="flex-1" error={error}>
                        <input
                            placeholder="Nome"
                            class="input input-full"
                            value={value}
                            {...props}
                        />
                    </InputError>
                )}
            </Field>
            <button class="btn btn-main self-end" type="submit">
                Adicionar 1 bloco
            </button>
        </Form>
    )
}

export default GroupForm
