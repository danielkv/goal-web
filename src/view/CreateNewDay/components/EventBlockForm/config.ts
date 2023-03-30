import { omit } from 'radash'
import { z } from 'zod'
import { EventBlock } from '../../../../common/models/block'

import { ZodShape } from '../../../../common/types/app'
import { initialEventBlockValues } from '../../config'

export type TEventBlockForm = Omit<EventBlock, 'rounds' | 'type'>

export const eventBlockInitialValues: TEventBlockForm = omit(initialEventBlockValues, [
    'rounds',
    'type',
])

export const eventBlockFormSchema = z.object<ZodShape<TEventBlockForm>>({
    event_type: z.enum(['for_time', 'max_weight', 'emom', 'amrap']),
    name: z.optional(z.string()),
    timecap: z.optional(z.number({ invalid_type_error: 'Número inválido' })),
})
