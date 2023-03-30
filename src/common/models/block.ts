export type EventType = 'for_time' | 'max_weight' | 'emom' | 'amrap'

export interface MovementWeight {
    type: 'kg' | 'lb' | '%'
    value: number
}

export interface EventMovement {
    name: string
    reps: number
    weight?: MovementWeight
    videoUrl?: string
}

export interface EventRound {
    name?: string
    repeat?: number
    movements: EventMovement[]
}

export type BlockType = 'event' | 'rest' | 'text' | ''

export interface EventBlockEMOM {
    event_type: 'emom'
    each: number
    for: number
}

export interface EventBlockTimecap {
    event_type: Exclude<EventType, 'emom'>
    timecap: number // seconds
}

export type EventBlock = {
    type: 'event'
    name?: string
    rounds: EventRound[]
    event_type: EventType
} & (EventBlockEMOM | EventBlockTimecap)

export interface RestBlock {
    type: 'rest'
    time: number
    text?: string
}

export interface TextBlock {
    type: 'text'
    text: string
}

interface EmptyBlock {
    type: ''
}

export type Block = { info?: string; type: BlockType } & (
    | EventBlock
    | RestBlock
    | TextBlock
    | EmptyBlock
)
