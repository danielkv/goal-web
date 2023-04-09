import { Block, EventRound } from './block'

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
    id?: string
    name: string
    info?: string
    startDate: string // YYYY-MM-DD
    days: Day[]
}

export type TPeaces = Day | Period | Group | Block | EventRound

export type WorksheetModel = Omit<Worksheet, 'id'> & { id: string }
