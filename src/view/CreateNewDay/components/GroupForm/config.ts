import { omit } from 'radash'
import { z } from 'zod'
import { Group } from '../../../../common/models/day'
import { ZodShape } from '../../../../common/types/app'
import { initialGroupValues } from '../../config'

export type TGroupForm = Omit<Group, 'blocks'>

export const groupInitialValues: TGroupForm = omit(initialGroupValues, ['blocks'])

export const groupFormSchema = z.object<ZodShape<TGroupForm>>({
    name: z.string({ required_error: 'Nome é obrigatório' }).nonempty('Nome é obrigatório'),
})
