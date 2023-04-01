import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'

import {
    Block,
    BlockType,
    EventBlock,
    EventMovement,
    EventRound,
    MovementWeight,
    RestBlock,
    TextBlock,
} from '@models/block'
import { Day, Group, Period, Worksheet } from '@models/day'

import { Path } from './types'

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

export const initialPeriodValues: Period = {
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

export const [currentPath, setCurrentPath] = createSignal<Path>('worksheet')

export const [worksheetStore, setWorksheetStore] = createStore<Worksheet>({
    name: 'Planilha tal',
    startDate: '2023-04-01',
    days: [
        {
            name: 'Semana deload',
            date: '2023-03-07',
            periods: [
                {
                    name: 'Período 1',
                    groups: [
                        {
                            name: 'Aquecimento',
                            blocks: [
                                { type: 'rest', time: 600, text: 'ola bloco rest' },
                                { type: 'text', text: 'ola bloco de texto' },
                                {
                                    type: 'event',
                                    event_type: 'for_time',
                                    rounds: [
                                        {
                                            name: '',
                                            repeat: 2,
                                            movements: [
                                                {
                                                    name: '1233',
                                                    reps: 0,
                                                },
                                            ],
                                        },
                                    ],
                                    timecap: 600,
                                    info: '',
                                    name: '',
                                },
                            ],
                        },
                    ],
                },
                {
                    groups: [
                        {
                            name: 'Aquecimento',
                            blocks: [
                                { type: 'text', text: 'ola bloco de texto' },
                                {
                                    type: 'event',
                                    event_type: 'emom',
                                    each: 120,
                                    for: 600,
                                    rounds: [
                                        {
                                            name: '',
                                            repeat: 2,
                                            movements: [
                                                {
                                                    name: '1233',
                                                    reps: 0,
                                                },
                                            ],
                                        },
                                    ],
                                    info: '',
                                    name: '',
                                },
                                { type: 'rest', time: 600, text: 'ola bloco rest' },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
