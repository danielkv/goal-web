import { ZodType } from 'zod'

export type ZodShape<T extends Record<string, any>> = Required<{
    [k in keyof T]: ZodType<T[k]>
}>

export type NestedKeyOf<ObjectType extends object> = ObjectType extends Array<infer T>
    ? T extends object
        ? number | `${number}.${NestedKeyOf<T>}`
        : number
    : {
          [Key in keyof ObjectType]: ObjectType[Key] extends object
              ? // @ts-ignore
                Key | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
              : Key
      }[keyof ObjectType & (string | number)]
