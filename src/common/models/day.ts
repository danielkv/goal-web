import { Block } from './block'

export interface Group {
    name: string
    blocks: Block[]
}

export interface Period {
    name?: string
    groups: Group[]
}

export interface Day {
    name: string
    date: string // YYYY-MM-DD
    periods: Period[]
}

export interface Worksheet {
    name: string
    info?: string
    startDate: string // YYYY-MM-DD
    days: Day[]
}
