import { Component } from 'solid-js'
import { createForm, Field, Form, zodForm, SubmitHandler } from '@modular-forms/solid'
import { eventBlockInitialValues, eventBlockFormSchema, TEventBlockForm } from './config'
import InputError from '../../../../common/components/InputError'

export interface BlockFormProps {
    onClickNext(data: TEventBlockForm): void
}

const EventBlockForm: Component<BlockFormProps> = ({ onClickNext }) => {
    const loginForm = createForm<TEventBlockForm>({
        validate: zodForm(eventBlockFormSchema),
        initialValues: eventBlockInitialValues,
    })

    const handleSubmit: SubmitHandler<TEventBlockForm> = (values) => {
        onClickNext(values)
    }

    return (
        <Form<TEventBlockForm>
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
                Adicionar 1 Round
            </button>
        </Form>
    )
}

export default EventBlockForm
