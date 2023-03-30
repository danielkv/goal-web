import { ZodType } from 'zod'

export type ZodShape<T extends Record<string, any>> = Required<{
    [k in keyof T]: ZodType<T[k]>
}>

type FieldValue = string | string[] | number | boolean | null | undefined | File | FileList
type IsTuple<T extends Array<any>> = number extends T['length'] ? false : true
type TupleKeys<T extends Array<any>> = Exclude<keyof T, keyof any[]>

type ValuePath<K extends string | number, V> = V extends string[]
    ? `${K}` | `${K}.${Paths<V>}`
    : V extends FieldValue | Blob
    ? `${K}`
    : `${K}.${Paths<V>}`

export type Paths<T> = T extends Array<infer V>
    ? IsTuple<T> extends true
        ? {
              [K in TupleKeys<T>]-?: ValuePath<K & string, T[K]>
          }[TupleKeys<T>]
        : ValuePath<number, V>
    : {
          [K in keyof T]-?: ValuePath<K & string, T[K]>
      }[keyof T]
