import { Block } from './block'

export type Group = {
    name: string
    blocks: Block[]
}

export type Period = {
    name?: string
    groups: Group[]
}

export type Day = {
    id?: string
    name: string
    date: string // YYYY-MM-DD
    periods: Period[]
}

export type Worksheet = {
    id?: string
    name: string
    info?: string
    startDate: string // YYYY-MM-DD
    days: Day[]
}
