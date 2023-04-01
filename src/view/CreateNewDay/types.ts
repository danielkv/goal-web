import { NestedKeyOf } from '@interfaces/app'
import { Worksheet } from '@models/day'

export type Path = `worksheet.${NestedKeyOf<Worksheet>}` | 'worksheet'
