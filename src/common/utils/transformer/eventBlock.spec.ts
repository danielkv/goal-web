import { describe, expect, it } from 'vitest'

import { IEventBlock } from '@models/block'

import { eventBlockTransformer } from './eventblock'

describe('Section transform toObject', () => {
    it('header "bloco:   emom 4 1m"', () => {
        const text = `bloco:   emom 4 1m
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

    it('header "BloCo: eMoM 4 1m"', () => {
        const text = `BloCo: eMoM 4 1m
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

    it('2 movements with header "BloCo:  2 rounds fortime 1m40s"', () => {
        const text = `BloCo:  2 rounds fortime 1m40s
		10/8 Snatch 50kg
		10 Hang Snatch 50/40%`

        const object = eventBlockTransformer.toObject(text)

        const expected: IEventBlock = {
            event_type: 'for_time',
            type: 'event',
            timecap: 100,
            numberOfRounds: 2,
            rounds: [
                {
                    type: 'not_timed',
                    movements: [
                        {
                            name: 'Snatch',
                            reps: '10/8',
                            weight: {
                                type: 'kg',
                                value: '50',
                            },
                        },
                        {
                            name: 'Hang Snatch',
                            reps: '10',
                            weight: {
                                type: '%',
                                value: '50/40',
                            },
                        },
                    ],
                },
            ],
        }

        expect(object).toMatchObject(expected)
    })

    it('3 movements with no header', () => {
        const text = `10/8 Snatch 50kg
		10 Hang Snatch 50/40%
		2-5-6 Snatch / Hang Snatch 50kg`

        const object = eventBlockTransformer.toObject(text)

        const expected: IEventBlock = {
            event_type: 'not_timed',
            type: 'event',
            rounds: [
                {
                    type: 'not_timed',
                    movements: [
                        {
                            name: 'Snatch',
                            reps: '10/8',
                            weight: {
                                type: 'kg',
                                value: '50',
                            },
                        },
                        {
                            name: 'Hang Snatch',
                            reps: '10',
                            weight: {
                                type: '%',
                                value: '50/40',
                            },
                        },
                        {
                            name: 'Snatch / Hang Snatch',
                            reps: '2-5-6',
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

    it('2 rounds 1 movement each', () => {
        const text = `10/8 Snatch 50kg

		10 Hang Snatch 50/40%`

        const object = eventBlockTransformer.toObject(text)

        const expected: IEventBlock = {
            event_type: 'not_timed',
            type: 'event',
            rounds: [
                {
                    type: 'not_timed',
                    movements: [
                        {
                            name: 'Snatch',
                            reps: '10/8',
                            weight: {
                                type: 'kg',
                                value: '50',
                            },
                        },
                    ],
                },
                {
                    type: 'not_timed',
                    movements: [
                        {
                            name: 'Hang Snatch',
                            reps: '10',
                            weight: {
                                type: '%',
                                value: '50/40',
                            },
                        },
                    ],
                },
            ],
        }

        expect(object).toMatchObject(expected)
    })

    it('2 complexes rounds second with header', () => {
        const text = `5 Deadlift + 4 Clean 50-60-70%

		3 rounds
		3 Hang Clean + 2 Squat Clean 55-65-75%`

        const object = eventBlockTransformer.toObject(text)

        const expected: IEventBlock = {
            event_type: 'not_timed',
            type: 'event',
            rounds: [
                {
                    type: 'complex',
                    movements: [
                        {
                            name: 'Deadlift',
                            reps: '5',
                            weight: {
                                type: '%',
                                value: '50-60-70',
                            },
                        },
                        {
                            name: 'Clean',
                            reps: '4',
                            weight: {
                                type: '%',
                                value: '50-60-70',
                            },
                        },
                    ],
                },
                {
                    type: 'complex',
                    numberOfRounds: 3,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
            ],
        }

        expect(object).toMatchObject(expected)
    })

    it('header "bloco: 3-2-1"', () => {
        const text = `bloco: 3-2-1
		3 Hang Clean + 2 Squat Clean 55-65-75%`

        const object = eventBlockTransformer.toObject(text)

        const expected: IEventBlock = {
            event_type: 'not_timed',
            type: 'event',
            rounds: [
                {
                    type: 'complex',
                    numberOfRounds: 3,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
                {
                    type: 'complex',
                    numberOfRounds: 2,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
                {
                    type: 'complex',
                    numberOfRounds: 1,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
            ],
        }

        expect(object).toMatchObject(expected)
    })

    it('header "bloco: 2-1 fortime"', () => {
        const text = `bloco: 2-1 fortime
		3 Hang Clean + 2 Squat Clean 55-65-75%`

        const object = eventBlockTransformer.toObject(text)

        const expected: IEventBlock = {
            event_type: 'for_time',
            timecap: 0,
            numberOfRounds: 1,
            type: 'event',
            rounds: [
                {
                    type: 'complex',
                    numberOfRounds: 2,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
                {
                    type: 'complex',
                    numberOfRounds: 1,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
            ],
        }

        expect(object).toMatchObject(expected)
    })

    it('header "bloco: fortime 10min"', () => {
        const text = `bloco: fortime 10min
		3 Hang Clean + 2 Squat Clean 55-65-75%`

        const object = eventBlockTransformer.toObject(text)

        const expected: IEventBlock = {
            event_type: 'for_time',
            timecap: 600,
            numberOfRounds: 1,
            type: 'event',
            rounds: [
                {
                    type: 'complex',
                    numberOfRounds: 1,
                    movements: [
                        {
                            name: 'Hang Clean',
                            reps: '3',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                        {
                            name: 'Squat Clean',
                            reps: '2',
                            weight: {
                                type: '%',
                                value: '55-65-75',
                            },
                        },
                    ],
                },
            ],
        }

        expect(object).toMatchObject(expected)
    })
})
