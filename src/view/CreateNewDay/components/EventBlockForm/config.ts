import { omit } from 'radash'
import { z } from 'zod'

import { EventBlock, EventType } from '../../../../common/models/block'
import { ZodShape } from '../../../../common/types/app'
import { initialEventBlockValues } from '../../config'

export type TEventBlockForm = Omit<EventBlock, 'rounds' | 'type'> & {
    each?: number
    for?: number
    timecap?: number
}

export const eventTypes: { key: EventType; label: string }[] = [
    { key: 'for_time', label: 'For Time' },
    { key: 'amrap', label: 'AMRAP' },
    { key: 'emom', label: 'EMOM' },
    { key: 'max_weight', label: 'Carga máxima' },
]

export const eventBlockInitialValues: TEventBlockForm = omit(initialEventBlockValues, [
    'rounds',
    'type',
])

export const eventBlockFormSchema = z
    .object<ZodShape<TEventBlockForm>>({
        event_type: z.enum(['for_time', 'max_weight', 'emom', 'amrap']),
        name: z.optional(z.string()),
        timecap: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
        each: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
        for: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
    })
    .superRefine((values, ctx) => {
        console.log(values)
        if (values.event_type === 'emom') {
            if (!values.each)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Campo 'cada' é obrigatório para EMOM",
                    path: ['each'],
                })

            if (!values.for)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Campo 'por' é obrigatório para EMOM",
                    path: ['for'],
                })
        } else {
            if (values.timecap === 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Campo 'timecap' é obrigatório",
                    path: ['timecap'],
                })
            }
        }
    })
