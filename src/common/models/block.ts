export type TEventType = 'for_time' | 'max_weight' | 'emom' | 'amrap' | 'tabata' | 'not_timed'

export type TWeightTypes = 'kg' | 'lb' | '%' | 'none'

export type TMovementWeight = {
    type: TWeightTypes
    value: string
}

export type IEventMovement = {
    name: string
    reps: string
    weight?: TMovementWeight
    videoUrl?: string
}

export type IEventRound = {
    name?: string
    repeat?: string
    movements: IEventMovement[]
}

export type TBlockType = 'event' | 'rest' | 'text' | ''

export type IEventBlockEMOM = {
    event_type: 'emom'
    each: number
    numberOfRounds: number
}

export type IEventBlockTabata = {
    event_type: 'tabata'
    work: number
    rest: number
    numberOfRounds: number
}

export type IEventBlockTimecap = {
    event_type: Exclude<TEventType, 'emom' | 'not_timed' | 'tabata'>
    timecap: number // seconds
}

export type IEventBlockNotTimed = {
    event_type: 'not_timed'
}

export type IEventBlock = {
    type: 'event'
    name?: string
    rounds: IEventRound[]
    event_type: TEventType
} & (IEventBlockEMOM | IEventBlockTimecap | IEventBlockNotTimed | IEventBlockTabata)

export type IRestBlock = {
    type: 'rest'
    time: number
    text?: string
}

export type ITextBlock = {
    type: 'text'
    text: string
}

export type IEmptyBlock = {
    type: ''
}

export type IBlock = { info?: string; type: TBlockType } & (IEventBlock | IRestBlock | ITextBlock | IEmptyBlock)
