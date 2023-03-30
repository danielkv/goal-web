import { Component, For, JSX } from 'solid-js'
import {
    createForm,
    Field,
    Form,
    zodForm,
    SubmitHandler,
    FieldArray,
    insert,
    remove,
} from '@modular-forms/solid'
import { roundInitialValues, eventBlockFormSchema, TRoundForm, weightTypes } from './config'

import TextInput from '../../../../common/components/TextInput'
import { initialRoundMovementValues } from '../../config'

export interface BlockFormProps {
    onClickNext(data: TRoundForm): void
}

const RoundForm: Component<BlockFormProps> = ({ onClickNext }) => {
    const form = createForm<TRoundForm>({
        validate: zodForm(eventBlockFormSchema),
        initialValues: roundInitialValues,
        validateOn: 'submit',
    })

    const handleSubmit: SubmitHandler<TRoundForm> = (values) => {
        onClickNext(values)
    }

    const handleClickAddMovement: JSX.CustomEventHandlersCamelCase<HTMLButtonElement>['onClick'] = (
        e
    ) => {
        e.preventDefault()

        insert(form, 'movements', { value: initialRoundMovementValues })
    }

    return (
        <Form<TRoundForm>
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
            <Field of={form} name="repeat">
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

            <div class="section-title">Movimentos</div>
            <FieldArray of={form} name="movements">
                {(array) => (
                    <For each={array.items}>
                        {(_, index) => (
                            <div class="paper flex flex-col gap-6">
                                <Field of={form} name={`${array.name}.${index()}.name`}>
                                    {(field) => (
                                        <>
                                            <div>{field.value}</div>
                                            <TextInput
                                                {...field.props}
                                                class="flex-1"
                                                label="Nome"
                                                value={field.value}
                                                error={field.error}
                                            />
                                        </>
                                    )}
                                </Field>
                                <Field of={form} name={`${array.name}.${index()}.reps`}>
                                    {(field) => (
                                        <TextInput
                                            {...field.props}
                                            class="flex-1"
                                            label="Repetições"
                                            type="number"
                                            value={field.value}
                                            error={field.error}
                                        />
                                    )}
                                </Field>

                                <div class="flex gap-6 items-start">
                                    <Field of={form} name={`${array.name}.${index()}.weight.type`}>
                                        {(field) => (
                                            <select class="input w-40" {...field.props}>
                                                <For each={weightTypes}>
                                                    {(item) => (
                                                        <option
                                                            value={item.key}
                                                            selected={field.value === item.key}
                                                        >
                                                            {item.label}
                                                        </option>
                                                    )}
                                                </For>
                                            </select>
                                        )}
                                    </Field>
                                    <Field of={form} name={`${array.name}.${index()}.weight.value`}>
                                        {(field) => (
                                            <TextInput
                                                {...field.props}
                                                class="flex-1"
                                                label="Peso"
                                                type="number"
                                                value={field.value}
                                                error={field.error}
                                            />
                                        )}
                                    </Field>
                                </div>
                                <button
                                    class="btn btn-light self-end"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        remove(form, 'movements', { at: index() })
                                    }}
                                >
                                    Remover
                                </button>
                            </div>
                        )}
                    </For>
                )}
            </FieldArray>

            <button class="btn self-end" onClick={handleClickAddMovement}>
                Adicionar 1 movimento
            </button>

            <button class="btn btn-main self-end" type="submit">
                Confirmar
            </button>
        </Form>
    )
}

export default RoundForm
