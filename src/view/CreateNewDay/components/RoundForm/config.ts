import { A } from '@solidjs/router'
import { z } from 'zod'
import {
    EventMovement,
    EventRound,
    MovementWeight,
    WeightTypes,
} from '../../../../common/models/block'

import { ZodShape } from '../../../../common/types/app'
import { initialEventRoundValues } from '../../config'

export type TRoundForm = Omit<EventRound, ''>

export const roundInitialValues: TRoundForm = initialEventRoundValues

export const weightTypes: { key: WeightTypes; label: string }[] = [
    { key: 'none', label: 'Sem carga' },
    { key: '%', label: 'Porcentagem' },
    { key: 'kg', label: 'Kilos' },
    { key: 'lb', label: 'Libras' },
]

export const eventBlockFormSchema = z.object<ZodShape<TRoundForm>>({
    name: z.string(),
    repeat: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
    movements: z.array(
        z.object<ZodShape<EventMovement>>({
            name: z
                .string({
                    required_error: 'Nome é obrigatório',
                    invalid_type_error: 'Não é um texto',
                })
                .nonempty('Nome é obrigatório'),
            reps: z.number({
                invalid_type_error: 'Número inválido',
                required_error: 'N de Repetições é obrigatório',
            }),
            videoUrl: z.optional(z.string()),
            weight: z.optional(
                z
                    .object<ZodShape<MovementWeight>>({
                        type: z.enum(['none', 'kg', 'lb', '%']),
                        value: z.custom<number>().optional(),
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
