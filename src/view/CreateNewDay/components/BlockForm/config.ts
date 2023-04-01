import { z } from 'zod'

import { Block, BlockType } from '@models/block'

import { initialBlockValues } from '../../config'

import { eventBlockFormSchema } from './EventBlockForm/config'
import { restBlockFormSchema } from './RestBlockForm/config'
import { textBlockFormSchema } from './TextBlockForm/config'

export type TBlockForm = Block

export const blockInitialValues: TBlockForm = initialBlockValues

export const blockTypes: { key: BlockType; label: string }[] = [
    { key: '', label: '' },
    { key: 'event', label: 'Evento / Exercício' },
    { key: 'rest', label: 'REST' },
    { key: 'text', label: 'Texto' },
]

export const blockFormSchema = z.union([
    z.object({
        type: z.enum(['']),
        info: z.optional(z.string()),
    }),
    eventBlockFormSchema,
    textBlockFormSchema,
    restBlockFormSchema,
])
