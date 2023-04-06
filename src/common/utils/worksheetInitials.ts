import {
    Block,
    BlockType,
    EventBlock,
    EventMovement,
    EventRound,
    EventType,
    MovementWeight,
    RestBlock,
    TextBlock,
} from '@models/block'
import { Day, Group, Period, Worksheet } from '@models/day'

export const initialMovementWeightValues: MovementWeight = {
    type: 'kg',
    value: '',
}

export const initialRoundMovementValues: EventMovement = {
    name: '',
    reps: '',
}
export const initialEventRoundValues: EventRound = {
    movements: [],
    name: '',
    repeat: '',
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

export const initialPeriodValues: Period = {
    name: '',
    groups: [],
}

export const initialDayValues: Day = {
    name: '',
    date: '',
    periods: [],
}

export const initialWorksheetValues: Worksheet = {
    name: '',
    startDate: '',
    days: [],
}

export const breadCrumbLabelMaps: Record<string, string> = {
    worksheet: 'Planilha',
    periods: 'Período',
    days: 'Dia',
    groups: 'Grupo',
    blocks: 'Bloco',
    rounds: 'Round',
}

export const blockTypesMap: Record<Exclude<BlockType, ''>, string> = {
    event: 'Evento ',
    rest: 'REST',
    text: 'Texto',
}

export const eventTypesMap: Record<EventType, string> = {
    for_time: 'For Time',
    amrap: 'AMRAP',
    emom: 'EMOM',
    max_weight: 'Carga máxima',
}
