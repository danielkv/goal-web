import { NestedKeyOf } from '@interfaces/app'
import { IWorksheet } from '@models/day'

export type ConvertPath<Path extends object> = `worksheet.${NestedKeyOf<Path>}` | 'worksheet'

export type Path = ConvertPath<IWorksheet>
