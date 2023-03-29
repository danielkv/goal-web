export type EventType = 'for_time' | 'max_weight' | 'emom' | 'amrap'

export interface MovementWeight {
    type: 'kg' | 'lb' | '%'
    value: number
}

export interface EventMovement {
    name: string
    reps: number
    weight: MovementWeight
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
