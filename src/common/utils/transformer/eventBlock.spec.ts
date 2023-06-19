import { describe, expect, it } from 'vitest'

import { IEventBlock } from '@models/block'

import { eventBlockTransformer } from './eventblock'

describe('Section transform toObject', () => {
    it('Simple block text', () => {
        expect(1).toBeTruthy()

        const text = `bloco: 4 emom 1m
		10 snatch 50kg`

        const object = eventBlockTransformer.toObject(text)

        const expected: IEventBlock = {
            event_type: 'emom',
            type: 'event',
            each: 60,
            numberOfRounds: 4,
            rounds: [
                {
                    type: 'not_timed',
                    movements: [
                        {
                            name: 'snatch',
                            reps: '10',
                            weight: {
                                type: 'kg',
                                value: '50',
                            },
                        },
                    ],
                },
            ],
        }

        expect(object).toMatchObject(expected)
    })

    it('Simple block text with uppercase', () => {
        expect(1).toBeTruthy()

        const text = `BloCo: 4 eMoM 1m
		10 snatch 50kg`

        const object = eventBlockTransformer.toObject(text)

        const expected: IEventBlock = {
            event_type: 'emom',
            type: 'event',
            each: 60,
            numberOfRounds: 4,
            rounds: [
                {
                    type: 'not_timed',
                    movements: [
                        {
                            name: 'snatch',
                            reps: '10',
                            weight: {
                                type: 'kg',
                                value: '50',
                            },
                        },
                    ],
                },
            ],
        }

        expect(object).toMatchObject(expected)
    })
})
