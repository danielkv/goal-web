import { z } from 'zod'
import { TextBlock } from '../../../../common/models/block'

import { ZodShape } from '../../../../common/types/app'
import { initialTextBlockValues } from '../../config'

export type TRestBlockForm = Omit<TextBlock, 'type'>

export const textBlockInitialValues: TRestBlockForm = initialTextBlockValues

export const restBlockBlockFormSchema = z.object<ZodShape<TRestBlockForm>>({
    text: z.string(),
})
