import { Component } from 'solid-js'
import { createForm, Field, Form, zodForm, SubmitHandler } from '@modular-forms/solid'
import { dayForemInitialValues, dayFormSchema, TDayForm } from './config'
import InputError from '../../../../common/components/InputError'

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
                    {({ error, props, value }) => (
                        <InputError error={error}>
                            <input
                                placeholder="Período"
                                type="number"
                                class="input input-full"
                                value={value}
                                {...props}
                            />
                        </InputError>
                    )}
                </Field>
                <Field of={loginForm} name="date">
                    {({ error, props, value }) => (
                        <InputError class="flex-1" error={error}>
                            <input
                                placeholder="Data"
                                type="date"
                                class="input input-full"
                                value={value}
                                {...props}
                            />
                        </InputError>
                    )}
                </Field>
            </div>

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
                Adicionar 1 grupo
            </button>
        </Form>
    )
}

export default DayForm
