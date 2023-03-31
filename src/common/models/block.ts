export type EventType = 'for_time' | 'max_weight' | 'emom' | 'amrap'

export type WeightTypes = 'kg' | 'lb' | '%' | 'none'

export type MovementWeight = {
    type: WeightTypes
    value?: number
}

export type EventMovement = {
    name: string
    reps: number
    weight?: MovementWeight
    videoUrl?: string
}

export type EventRound = {
    name?: string
    repeat?: number
    movements: EventMovement[]
}

export type BlockType = 'event' | 'rest' | 'text' | ''

export type EventBlockEMOM = {
    event_type: 'emom'
    each: number
    for: number
}

export type EventBlockTimecap = {
    event_type: Exclude<EventType, 'emom'>
    timecap: number // seconds
}

export type EventBlock = {
    type: 'event'
    name?: string
    rounds: EventRound[]
    event_type: EventType
} & (EventBlockEMOM | EventBlockTimecap)

export type RestBlock = {
    type: 'rest'
    time: number
    text?: string
}

export type TextBlock = {
    type: 'text'
    text: string
}

type EmptyBlock = {
    type: ''
}

export type Block = { info?: string; type: BlockType } & (
    | EventBlock
    | RestBlock
    | TextBlock
    | EmptyBlock
)
