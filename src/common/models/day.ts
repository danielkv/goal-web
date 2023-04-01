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
    name: string
    date: string // YYYY-MM-DD
    periods: Period[]
}

export type Worksheet = {
    name: string
    info?: string
    startDate: string // YYYY-MM-DD
    days: Day[]
}
