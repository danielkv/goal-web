import { IEMOMTimer, ITabataTimer, ITimecapTimer, TTimerType } from './time'

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

export type IRoundTimecap = {
    type: Exclude<TTimerType, 'emom' | 'not_timed' | 'tabata'>
} & ITimecapTimer

export type IRoundEMOM = {
    type: 'emom'
} & IEMOMTimer

export type IRoundTabata = {
    type: 'tabata'
} & ITabataTimer

export type IRoundRest = {
    type: 'rest'
    time: number
}

export type IRoundNotTimed = {
    type: 'not_timed'
}

export type IRound = {
    type: TTimerType | 'rest'
    numberOfRounds?: number
    movements: IEventMovement[]
} & (IRoundTimecap | IRoundEMOM | IRoundTabata | IRoundRest | IRoundNotTimed)

export type TBlockType = 'event' | 'rest' | 'text' | ''

export type IEventBlockEMOM = {
    event_type: 'emom'
} & IEMOMTimer

export type IEventBlockTabata = {
    event_type: 'tabata'
} & ITabataTimer

export type TEventType = TTimerType | 'max_weight'
export type IEventBlockTimecap = {
    event_type: 'for_time' | 'amrap' | 'max_weight'
} & ITimecapTimer

export type IEventBlockNotTimed = {
    event_type: 'not_timed'
}

export type IEventBlock = {
    type: 'event'
    name?: string
    rounds: IRound[]
    event_type: TEventType
    numberOfRounds?: number
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
