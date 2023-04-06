import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { TextBlock } from '@models/block'
import { createTextBlockValues } from '@utils/worksheetInitials'

export type TRestBlockForm = Omit<TextBlock, 'type'>

export const textBlockInitialValues: TRestBlockForm = createTextBlockValues()

export const textBlockFormSchema = z.object<ZodShape<TRestBlockForm>>({
    text: z.string({ required_error: 'Texto é obrigatório' }).nonempty('Texto é obrigatório'),
})
