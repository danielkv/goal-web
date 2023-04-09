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

export function createMovementWeightValues(): MovementWeight {
    return {
        type: 'kg',
        value: '',
    }
}

export function createRoundMovementValues(): EventMovement {
    return {
        name: '',
        reps: '',
    }
}
export function createEventRoundValues(): EventRound {
    return {
        movements: [],
        name: '',
        repeat: '',
    }
}

export function createEventBlockValues(): EventBlock {
    return {
        type: 'event',
        name: '',
        event_type: 'not_timed',
        rounds: [],
    }
}

export function createRestBlockValues(): RestBlock {
    return {
        type: 'rest',
        time: 120,
    }
}

export function createTextBlockValues(): TextBlock {
    return {
        type: 'text',
        text: '',
    }
}

export function createBlockValues(): Block {
    return { type: '', info: '' }
}

export function createGroupValues(): Group {
    return { name: '', blocks: [] }
}

export function createPeriodValues(): Period {
    return {
        name: '',
        groups: [],
    }
}

export function createDayValues(): Day {
    return {
        name: '',
        date: '',
        periods: [],
    }
}

export function createWorksheetValues(): Worksheet {
    return {
        name: '',
        startDate: '',
        days: [],
    }
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
    not_timed: 'Sem tempo',
    for_time: 'For Time',
    amrap: 'AMRAP',
    emom: 'EMOM',
    max_weight: 'Carga máxima',
}
