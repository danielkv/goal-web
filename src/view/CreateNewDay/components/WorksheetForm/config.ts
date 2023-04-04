import { omit } from 'radash'
import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { Worksheet } from '@models/day'

import { initialWorksheetValues } from '../../config'

export type TWorksheetForm = Omit<Worksheet, 'days' | 'id'>

export const worksheetInitialValues: TWorksheetForm = omit(initialWorksheetValues, ['days'])

export const worksheetFormSchema = z.object<ZodShape<TWorksheetForm>>({
    name: z.string({ required_error: 'Nome é obrigatório' }).nonempty('Nome é obrigatório'),
    startDate: z
        .string({ required_error: 'Data de início é obrigatória' })
        .nonempty('Data de início é obrigatória'),
    info: z.string().optional(),
})
