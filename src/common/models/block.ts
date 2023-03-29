export type EventType = 'for_time' | 'max_weight' | 'emom' | 'amrap'

export interface MovementWeight {
    type: 'kg' | 'lb' | '%'
    value: number
}

export interface EventMovement {
    name: string
    reps: number
    weight: MovementWeight
    videoUrl?: string
}

export interface EventRound {
    name?: string
    repeat?: number
    movements: EventMovement[]
}

export interface Event {
    name?: string
    timecap?: number // seconds
    type: EventType
    rounds: EventRound[]
}

export type BlockType = 'event' | 'rest' | 'text'

interface EventBlock {
    type: 'event'
    event: Event
}

interface RestBlock {
    type: 'rest'
    time: number
    text?: string
}

interface TextBlock {
    type: 'text'
    text: number
}

export type Block = { info?: string } & (EventBlock | RestBlock | TextBlock)
