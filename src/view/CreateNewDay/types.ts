import { NestedKeyOf } from '@interfaces/app'
import { Day } from '@models/day'

export type Path = `day.${NestedKeyOf<Day>}` | 'day'
