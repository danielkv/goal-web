import { Component } from 'solid-js'

import TextInput from '@components/TextInput'
import { Day } from '@models/day'
import { Field, Form, SubmitHandler, createForm, zodForm } from '@modular-forms/solid'

import { TDayForm, dayFormSchema } from './config'

export interface DayFormProps {
    onClickNext(data: TDayForm): void
    day: Day
}

const DayForm: Component<DayFormProps> = ({ onClickNext, day }) => {
    const loginForm = createForm<TDayForm>({
        validate: zodForm(dayFormSchema),
        initialValues: day,
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
                            {...field.props}
                            class="flex-1"
                            label="Período"
                            type="number"
                            value={field.value}
                            error={field.error}
                        />
                    )}
                </Field>
                <Field of={loginForm} name="date">
                    {(field) => (
                        <TextInput
                            {...field.props}
                            class="flex-1"
                            label="Data"
                            type="date"
                            value={field.value}
                            error={field.error}
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
                Confirmar
            </button>
        </Form>
    )
}

export default DayForm
