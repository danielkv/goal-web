import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { Block, BlockType } from '@models/block'

import { initialBlockValues } from '../../config'

export type TBlockForm = Pick<Block, 'type'>

export const blockInitialValues: TBlockForm = initialBlockValues

export const blockTypes: { key: BlockType; label: string }[] = [
    { key: '', label: '' },
    { key: 'event', label: 'Evento / Exercício' },
    { key: 'rest', label: 'REST' },
    { key: 'text', label: 'Texto' },
]

export const blockBlockFormSchema = z.object<ZodShape<TBlockForm>>({
    type: z.enum(['event', 'rest', 'text', '']),
})
