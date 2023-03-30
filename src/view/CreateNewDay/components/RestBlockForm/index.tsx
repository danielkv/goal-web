import { Component, For, JSX, Show } from 'solid-js'
import { createForm, Field, Form, zodForm, SubmitHandler, FieldArray } from '@modular-forms/solid'
import { restBlockInitialValues, restBlockBlockFormSchema, TRestBlockForm } from './config'

import TextInput from '../../../../common/components/TextInput'

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
                Adicionar 1 Round
            </button>
        </Form>
    )
}

export default RestBlockForm
