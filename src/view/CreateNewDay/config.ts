import {
    Block,
    EventBlock,
    EventMovement,
    EventRound,
    MovementWeight,
    RestBlock,
    TextBlock,
} from '@models/block'
import { Day, Group } from '@models/day'

export const initialMovementWeightValues: MovementWeight = {
    type: 'kg',
    value: 100,
}

export const initialRoundMovementValues: EventMovement = {
    name: '',
    reps: 0,
}
export const initialEventRoundValues: EventRound = {
    movements: [],
}

export const initialEventBlockValues: EventBlock = {
    type: 'event',
    name: '',
    event_type: 'for_time',
    timecap: 600,
    rounds: [],
}

export const initialRestBlockValues: RestBlock = {
    type: 'rest',
    time: 120,
}

export const initialTextBlockValues: TextBlock = {
    type: 'text',
    text: '',
}

export const initialBlockValues: Block = { type: '', info: '' }

export const initialGroupValues: Group = { name: '', blocks: [] }

export const initialDayValues: Day = {
    name: '',
    date: '',
    period: 1,
    groups: [],
}

export const breadCrumbLabelMaps: Record<string, string> = {
    day: 'Dia',
    groups: 'Grupo',
    blocks: 'Bloco',
    round: 'Round',
}
