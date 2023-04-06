import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { TextBlock } from '@models/block'
import { initialTextBlockValues } from '@utils/worksheetInitials'

export type TRestBlockForm = Omit<TextBlock, 'type'>

export const textBlockInitialValues: TRestBlockForm = initialTextBlockValues

export const textBlockFormSchema = z.object<ZodShape<TRestBlockForm>>({
    text: z.string({ required_error: 'Texto é obrigatório' }).nonempty('Texto é obrigatório'),
})
