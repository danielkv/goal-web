import { Component } from 'solid-js'
import { createForm, Field, Form, zodForm, SubmitHandler } from '@modular-forms/solid'
import { dayForemInitialValues, dayFormSchema, TDayForm } from './config'
import TextInput from '../../../../common/components/TextInput'

export interface DayFormProps {
    onClickNext(data: TDayForm): void
}

const DayForm: Component<DayFormProps> = ({ onClickNext }) => {
    const loginForm = createForm<TDayForm>({
        validate: zodForm(dayFormSchema),
        initialValues: dayForemInitialValues,
    })

    const handleSubmit: SubmitHandler<TDayForm> = (values) => {
        onClickNext(values)
    }

    return (
        <Form<TDayForm>
            of={loginForm}
            name="teste"
            class="flex flex-col gap-6"
            onSubmit={handleSubmit}
        >
            <div class="flex gap-6 items-start ">
                <Field of={loginForm} name="period">
                    {(field) => (
                        <TextInput
                            class="flex-1"
                            label="Período"
                            value={field.value}
                            error={field.error}
                            {...field.props}
                        />
                    )}
                </Field>
                <Field of={loginForm} name="date">
                    {(field) => (
                        <TextInput
                            class="flex-1"
                            label="Data"
                            value={field.value}
                            error={field.error}
                            {...field.props}
                        />
                    )}
                </Field>
            </div>

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
                Adicionar 1 grupo
            </button>
        </Form>
    )
}

export default DayForm
