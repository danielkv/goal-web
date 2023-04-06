import { omit } from 'radash'
import { z } from 'zod'

import { ZodShape } from '@interfaces/app'
import { Period } from '@models/day'
import { initialPeriodValues } from '@utils/worksheetInitials'

export type TPeriodForm = Omit<Period, 'groups'>

export const periodInitialValues: TPeriodForm = omit(initialPeriodValues, ['groups'])

export const periodFormSchema = z.object<ZodShape<TPeriodForm>>({
    name: z.string().optional(),
})
