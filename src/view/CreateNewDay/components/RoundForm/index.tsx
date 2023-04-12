import { Component, For, JSX, Show, createEffect, createMemo, on } from 'solid-js'

import TextInput from '@components/TextInput'
import { EventRound } from '@models/block'
import {
    Field,
    FieldArray,
    Form,
    SubmitHandler,
    createForm,
    getValue,
    insert,
    remove,
    reset,
    setValue,
    zodForm,
} from '@modular-forms/solid'
import { createRoundMovementValues } from '@utils/worksheetInitials'

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

    const memoData = createMemo(() => props.round)
    createEffect(
        on(memoData, () => {
            reset(form, { initialValues: memoData() })
        })
    )

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

    const handleClickAddMovement: JSX.CustomEventHandlersCamelCase<HTMLButtonElement>['onClick'] = (e) => {
        e.preventDefault()

        insert(form, 'movements', { value: createRoundMovementValues() })
    }

    return (
        <Form<TRoundForm> of={form} name="teste" class="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Field of={form} name="name">
                {(field) => (
                    <TextInput {...field.props} class="flex-1" label="Nome" value={field.value} error={field.error} />
                )}
            </Field>
            <Field of={form} name="repeat">
                {(field) => (
                    <TextInput {...field.props} class="flex-1" label="Rounds" value={field.value} error={field.error} />
                )}
            </Field>

            <div class="section-title">Movimentos</div>
            <FieldArray of={form} name="movements">
                {(array) => (
                    <For each={array.items}>
                        {(_, index) => (
                            <div class="paper flex flex-col gap-3">
                                <Field of={form} name={`${array.name}.${index()}.name`}>
                                    {(field) => {
                                        const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
                                            const value = getValue(form, `${array.name}.${index()}.name`)

                                            const match = value?.match(/^([\d]+)\s+(.+)/)

                                            if (!match) return

                                            setValue(form, `${array.name}.${index()}.name`, match[2])
                                            setValue(form, `${array.name}.${index()}.reps`, match[1])

                                            field.props.onBlur(e)
                                        }

                                        return (
                                            <TextInput
                                                {...field.props}
                                                onBlur={handleBlur}
                                                class="flex-1"
                                                label="Nome"
                                                value={field.value}
                                                error={field.error}
                                            />
                                        )
                                    }}
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

                                <Field of={form} name={`${array.name}.${index()}.videoUrl`}>
                                    {(field) => (
                                        <TextInput
                                            {...field.props}
                                            class="flex-1"
                                            label="Vídeo"
                                            value={field.value}
                                            error={field.error}
                                        />
                                    )}
                                </Field>

                                <div class="flex gap-6 items-start">
                                    <Field of={form} name={`${array.name}.${index()}.weight.type`}>
                                        {(field) => (
                                            <div class="flex flex-1 flex-col">
                                                <label class="text-sm mb-2">Tipo de carga</label>
                                                <select class="input" {...field.props}>
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
                                    <Show when={getValue(form, `${array.name}.${index()}.weight.type`) !== 'none'}>
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
                                    </Show>
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
                Aplicar
            </button>
        </Form>
    )
}

export default RoundForm
