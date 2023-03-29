import { Block } from './block'

export interface Group {
    name: string
    blocks: Block[]
}

export interface Day {
    name: string
    period: number
    date: Date
    groups: Group[]
}
