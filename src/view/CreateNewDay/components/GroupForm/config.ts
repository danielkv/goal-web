import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { Group } from '@models/day'
import { createGroupValues } from '@utils/worksheetInitials'

export type TGroupForm = Omit<Group, 'blocks'>

export const groupInitialValues: TGroupForm = createGroupValues()

export const groupFormSchema = z.object<ZodShape<TGroupForm>>({
    name: z.string({ required_error: 'Nome é obrigatório' }).nonempty('Nome é obrigatório'),
})
