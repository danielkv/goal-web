import {
    IBlock,
    IEventBlock,
    IEventMovement,
    IEventRound,
    IRestBlock,
    ITextBlock,
    TBlockType,
    TEventType,
    TMovementWeight,
} from '@models/block'
import { IDay, IPeriod, ISection, IWorksheet } from '@models/day'

export function createMovementWeightValues(): TMovementWeight {
    return {
        type: 'kg',
        value: '',
    }
}

export function createRoundMovementValues(): IEventMovement {
    return {
        name: '',
        reps: '',
    }
}
export function createEventRoundValues(): IEventRound {
    return {
        movements: [],
        name: '',
        repeat: '',
    }
}

export function createEventBlockValues(): IEventBlock {
    return {
        type: 'event',
        name: '',
        event_type: 'not_timed',
        rounds: [],
    }
}

export function createRestBlockValues(): IRestBlock {
    return {
        type: 'rest',
        time: 120,
    }
}

export function createTextBlockValues(): ITextBlock {
    return {
        type: 'text',
        text: '',
    }
}

export function createBlockValues(): IBlock {
    return { type: '', info: '' }
}

export function createSectionValues(): ISection {
    return { name: '', blocks: [] }
}

export function createPeriodValues(): IPeriod {
    return {
        name: '',
        sections: [],
    }
}

export function createDayValues(): IDay {
    return {
        name: '',
        date: '',
        periods: [],
    }
}

export function createWorksheetValues(): IWorksheet {
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
    sections: 'Seção',
    blocks: 'Bloco',
    rounds: 'Round',
}

export const blockTypesMap: Record<Exclude<TBlockType, ''>, string> = {
    event: 'Evento ',
    rest: 'REST',
    text: 'Texto',
}

export const eventTypesMap: Record<TEventType, string> = {
    not_timed: 'Sem tempo',
    for_time: 'For Time',
    amrap: 'AMRAP',
    emom: 'EMOM',
    max_weight: 'Carga máxima',
}
