import { Component } from 'solid-js'

import TextInput from '@components/TextInput'
import { Worksheet } from '@models/day'
import { Field, Form, SubmitHandler, createForm, zodForm } from '@modular-forms/solid'

import { TWorksheetForm, worksheetFormSchema } from './config'

export interface WorksheetFormProps {
    onClickNext(data: TWorksheetForm): void
    worksheet: Worksheet
}

const WorksheetForm: Component<WorksheetFormProps> = (props) => {
    const form = createForm<TWorksheetForm>({
        validate: zodForm(worksheetFormSchema),
        initialValues: props.worksheet,
    })

    const handleSubmit: SubmitHandler<TWorksheetForm> = (values) => {
        props.onClickNext(values)
    }

    return (
        <Form<TWorksheetForm>
            of={form}
            name="teste"
            class="flex flex-col gap-6"
            onSubmit={handleSubmit}
        >
            <Field of={form} name="name">
                {(field) => (
                    <TextInput
                        {...field.props}
                        class="flex-1"
                        label="Nome"
                        value={field.value}
                        error={field.error}
                    />
                )}
            </Field>
            <Field of={form} name="startDate">
                {(field) => (
                    <TextInput
                        {...field.props}
                        class="flex-1"
                        type="date"
                        label="Data de início"
                        value={field.value}
                        error={field.error}
                    />
                )}
            </Field>
            <button class="btn btn-main self-end" type="submit">
                Aplicar
            </button>
        </Form>
    )
}

export default WorksheetForm
