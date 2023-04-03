import { Component, For, JSX, createEffect } from 'solid-js'

import TextInput from '@components/TextInput'
import { EventRound } from '@models/block'
import {
    Field,
    FieldArray,
    Form,
    SubmitHandler,
    createForm,
    insert,
    remove,
    reset,
    zodForm,
} from '@modular-forms/solid'

import { initialRoundMovementValues } from '../../config'

import { TRoundForm, eventRoundFormSchema, weightTypes } from './config'

export interface BlockFormProps {
    onClickNext(data: TRoundForm): void
    round: EventRound
}

const RoundForm: Component<BlockFormProps> = (props) => {
    const form = createForm<TRoundForm>({
        validate: zodForm(eventRoundFormSchema),
        initialValues: props.round,
    })

    createEffect(() => reset(form, { initialValues: props.round }))

    const handleSubmit: SubmitHandler<TRoundForm> = (values) => {
        const newValues = {
            ...values,
            movements: values.movements.map((mov) => {
                if (mov.weight?.type === 'none') delete mov.weight
                return mov
            }),
        }
        props.onClickNext(newValues)
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
                                        <TextInput
                                            {...field.props}
                                            class="flex-1"
                                            label="Nome"
                                            value={field.value}
                                            error={field.error}
                                        />
                                    )}
                                </Field>
                                <Field of={form} name={`${array.name}.${index()}.reps`}>
                                    {(field) => (
                                        <TextInput
                                            {...field.props}
                                            class="flex-1"
                                            label="Repetições"
                                            value={field.value}
                                            error={field.error}
                                        />
                                    )}
                                </Field>

                                <div class="flex gap-6 items-start">
                                    <Field of={form} name={`${array.name}.${index()}.weight.type`}>
                                        {(field) => (
                                            <div class="flex flex-col">
                                                <label class="text-sm mb-2">Tipo de carga</label>
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
                                            </div>
                                        )}
                                    </Field>
                                    <Field of={form} name={`${array.name}.${index()}.weight.value`}>
                                        {(field) => (
                                            <TextInput
                                                {...field.props}
                                                class="flex-1"
                                                label="Peso"
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
