import { Component } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, Form, SubmitHandler, createForm, zodForm } from '@modular-forms/solid'

import { TRestBlockForm, restBlockBlockFormSchema, restBlockInitialValues } from './config'

export interface RestBlockFormProps {
    onClickNext(data: TRestBlockForm): void
}

const RestBlockForm: Component<RestBlockFormProps> = ({ onClickNext }) => {
    const form = createForm<TRestBlockForm>({
        validate: zodForm(restBlockBlockFormSchema),
        initialValues: restBlockInitialValues,
        validateOn: 'submit',
    })

    const handleSubmit: SubmitHandler<TRestBlockForm> = (values) => {
        onClickNext(values)
    }

    return (
        <Form<TRestBlockForm>
            of={form}
            name="teste"
            class="flex flex-col gap-6"
            onSubmit={handleSubmit}
        >
            <Field of={form} name="time">
                {(field) => (
                    <TextInput
                        {...field.props}
                        class="flex-1"
                        label="repetir"
                        type="number"
                        value={field.value}
                        error={field.error}
                    />
                )}
            </Field>

            <Field of={form} name="text">
                {(field) => (
                    <TextInput
                        {...field.props}
                        class="flex-1"
                        label="Texto"
                        value={field.value}
                        error={field.error}
                    />
                )}
            </Field>

            <button class="btn btn-main self-end" type="submit">
                Confirmar
            </button>
        </Form>
    )
}

export default RestBlockForm
