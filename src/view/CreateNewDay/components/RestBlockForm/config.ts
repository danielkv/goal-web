import { z } from 'zod'

import { RestBlock } from '../../../../common/models/block'
import { ZodShape } from '../../../../common/types/app'
import { initialRestBlockValues } from '../../config'

export type TRestBlockForm = Omit<RestBlock, 'type'>

export const restBlockInitialValues: TRestBlockForm = initialRestBlockValues

export const restBlockBlockFormSchema = z.object<ZodShape<TRestBlockForm>>({
    time: z.number({ invalid_type_error: 'Tempo inválido' }),
    text: z.string().optional(),
})
