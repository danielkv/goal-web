import { ZodType } from 'zod'

export type ZodShape<T extends Record<string, any>> = Required<{
    [k in keyof T]: ZodType<T[k]>
}>
