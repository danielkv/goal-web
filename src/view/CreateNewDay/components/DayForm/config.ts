import { omit } from 'radash'
import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { Day } from '@models/day'

import { initialDayValues } from '../../config'

export type TDayForm = Omit<Day, 'periods' | 'id'>

export const dayForemInitialValues: TDayForm = omit(initialDayValues, ['periods'])

export const dayFormSchema = z.object<ZodShape<TDayForm>>({
    name: z.string({ required_error: 'Nome é obrigatório' }).nonempty('Nome é obrigatório'),
    date: z
        .string({ required_error: 'Data é obrigatória' })
        .nonempty('Data é obrigatória')
        .regex(/^(\d{4}-\d{2}-\d{2})?$/, { message: 'Data inválida' }),
})
