import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { RestBlock } from '@models/block'

import { initialRestBlockValues } from '../../config'

export type TRestBlockForm = Omit<RestBlock, 'type'>

export const restBlockInitialValues: TRestBlockForm = initialRestBlockValues

export const restBlockBlockFormSchema = z.object<ZodShape<TRestBlockForm>>({
    time: z.number({ invalid_type_error: 'Tempo inválido' }),
    text: z.string().optional(),
})
