import { Component } from 'solid-js'

import TextInput from '@components/TextInput'
import { TextBlock } from '@models/block'
import { Field, Form, SubmitHandler, createForm, zodForm } from '@modular-forms/solid'

import { TRestBlockForm, textBlockFormSchema } from './config'

export interface TextBlockFormProps {
    onClickNext(data: TRestBlockForm): void
    block: TextBlock
}

const TextBlockForm: Component<TextBlockFormProps> = (props) => {
    const form = createForm<TRestBlockForm>({
        validate: zodForm(textBlockFormSchema),
        initialValues: props.block,
        validateOn: 'submit',
    })

    const handleSubmit: SubmitHandler<TRestBlockForm> = (values) => {
        props.onClickNext(values)
    }

    return (
        <Form<TRestBlockForm>
            of={form}
            name="teste"
            class="flex flex-col gap-6"
            onSubmit={handleSubmit}
        >
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

export default TextBlockForm
