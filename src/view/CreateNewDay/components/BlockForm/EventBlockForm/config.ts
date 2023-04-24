import { omit } from 'radash'
import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { IEventBlock, TEventType } from '@models/block'
import { createEventBlockValues } from '@utils/worksheetInitials'

import { eventRoundFormSchema } from '../../RoundForm/config'

export type TEventBlockForm = Omit<IEventBlock, 'type'> & {
    each?: number
    for?: number
    timecap?: number
}

export const eventTypes: { key: TEventType; label: string }[] = [
    { key: 'not_timed', label: 'Sem tempo' },
    { key: 'for_time', label: 'For Time' },
    { key: 'amrap', label: 'AMRAP' },
    { key: 'emom', label: 'EMOM' },
    { key: 'max_weight', label: 'Carga máxima' },
]

export const eventBlockInitialValues: TEventBlockForm = omit(createEventBlockValues(), ['type'])

export const eventBlockFormSchema = z
    .object<ZodShape<TEventBlockForm>>({
        event_type: z.enum(['for_time', 'max_weight', 'emom', 'amrap', 'not_timed']),
        name: z.optional(z.string()),
        timecap: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
        each: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
        for: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
        rounds: z.array(eventRoundFormSchema),
    })
    .superRefine((values, ctx) => {
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
        } else if (values.event_type !== 'not_timed') {
            if (values.timecap === 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Campo 'timecap' é obrigatório",
                    path: ['timecap'],
                })
            }
        }
    })
