import {
    IBlock,
    IEventBlock,
    IEventMovement,
    IRestBlock,
    IRound,
    ITextBlock,
    TBlockType,
    TMovementWeight,
} from '@models/block'
import { IDay, IPeriod, ISection, IWorksheet } from '@models/day'
import { TTimerType } from '@models/time'

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
export function createEventRoundValues(): IRound {
    return {
        type: 'not_timed',
        numberOfRounds: 1,
        movements: [],
    }
}

export function createEventBlockValues(): IEventBlock {
    return {
        type: 'event',
        numberOfRounds: 1,
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

export const timerTypes: Record<TTimerType, string> = {
    not_timed: 'Sem tempo',
    for_time: 'For Time',
    amrap: 'AMRAP',
    emom: 'EMOM',
    tabata: 'Tabata',
}

export const eventTypes = {
    ...timerTypes,
    max_weight: 'Carga máxima',
}

export const roundTypes = {
    ...timerTypes,
    rest: 'Rest',
}
