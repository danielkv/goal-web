import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { EventMovement, EventRound, MovementWeight, WeightTypes } from '@models/block'

import { initialEventRoundValues } from '../../config'

export type TRoundForm = EventRound

export const roundInitialValues: TRoundForm = initialEventRoundValues

export const weightTypes: { key: WeightTypes; label: string }[] = [
    { key: 'none', label: 'Sem carga' },
    { key: '%', label: 'Porcentagem' },
    { key: 'kg', label: 'Kilos' },
    { key: 'lb', label: 'Libras' },
]

export const eventRoundFormSchema = z.object<ZodShape<TRoundForm>>({
    name: z.string(),
    repeat: z.optional(z.string()),
    movements: z.array(
        z.object<ZodShape<EventMovement>>({
            name: z
                .string({
                    required_error: 'Nome é obrigatório',
                    invalid_type_error: 'Não é um texto',
                })
                .nonempty('Nome é obrigatório'),
            reps: z.string(),
            videoUrl: z.optional(z.string()),
            weight: z.optional(
                z
                    .object<ZodShape<MovementWeight>>({
                        type: z.enum(['none', 'kg', 'lb', '%']),
                        value: z.custom<string>(),
                    })
                    .superRefine((values, ctx) => {
                        if (values.type !== 'none' && !values.value)
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: 'Peso é obrigatório',
                                path: ['value'],
                            })

                        ctx
                    })
            ),
        })
    ),
})
