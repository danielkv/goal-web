import { describe, expect, it } from 'vitest'

import { IBlock } from '@models/block'

import { sectionTransformer } from './section'

describe('Section transform toObject', () => {
    it('1 movement', () => {
        const text = `10 snatch 50kg`

        const object = sectionTransformer.toObject(text)

        const expected: IBlock[] = [
            {
                event_type: 'not_timed',
                type: 'event',
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
            },
        ]

        expect(object).toMatchObject(expected)
    })

    it('header "bloco:   emom 4 1m', () => {
        const text = `bloco:   emom 4 1m
		10 snatch 50kg`

        const object = sectionTransformer.toObject(text)

        const expected: IBlock[] = [
            {
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
            },
        ]

        expect(object).toMatchObject(expected)
    })

    it('1 round with header, 2 movements', () => {
        const text = `2 rounds
		10 snatch 50kg
		10 Clean 50kg
		`

        const object = sectionTransformer.toObject(text)

        const expected: IBlock[] = [
            {
                event_type: 'not_timed',
                type: 'event',
                rounds: [
                    {
                        type: 'not_timed',
                        numberOfRounds: 2,
                        movements: [
                            {
                                name: 'snatch',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                            {
                                name: 'Clean',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)
    })

    it('2 rounds header', () => {
        const text = `2 rounds
		10 snatch 50kg
		
		10 Clean 50kg
		`

        const object = sectionTransformer.toObject(text)

        const expected: IBlock[] = [
            {
                event_type: 'not_timed',
                type: 'event',
                rounds: [
                    {
                        type: 'not_timed',
                        numberOfRounds: 2,
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
                    {
                        type: 'not_timed',
                        numberOfRounds: 1,
                        movements: [
                            {
                                name: 'Clean',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)
    })

    it('3 rounds', () => {
        const text = `10 snatch 50kg

		2min rest
		
		10 Clean 50kg
		`

        const object = sectionTransformer.toObject(text)

        const expected: IBlock[] = [
            {
                event_type: 'not_timed',
                type: 'event',
                rounds: [
                    {
                        type: 'not_timed',
                        numberOfRounds: 1,
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
                    {
                        type: 'rest',
                        time: 120,
                        movements: [],
                    },
                    {
                        type: 'not_timed',
                        numberOfRounds: 1,
                        movements: [
                            {
                                name: 'Clean',
                                reps: '10',
                                weight: {
                                    type: 'kg',
                                    value: '50',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        expect(object).toMatchObject(expected)
    })

    it('2 blocks', () => {
        const text = `10 snatch 50kg
		-
		2min rest
		`

        const object = sectionTransformer.toObject(text)

        const expected: IBlock[] = [
            {
                event_type: 'not_timed',
                type: 'event',
                rounds: [
                    {
                        type: 'not_timed',
                        numberOfRounds: 1,
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
            },
            {
                type: 'rest',
                time: 120,
            },
        ]

        expect(object).toMatchObject(expected)
    })

    it('2 blocks with header', () => {
        const text = `
		bloco: amrap 30
		10 snatch 50kg
		-
		bloco: amrap 30s
		10 snatch 50kg
		`

        const object = sectionTransformer.toObject(text)

        const expected: IBlock[] = [
            {
                event_type: 'amrap',
                numberOfRounds: 1,
                timecap: 30,
                type: 'event',
                rounds: [
                    {
                        type: 'not_timed',
                        numberOfRounds: 1,
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
            },
            {
                event_type: 'amrap',
                numberOfRounds: 1,
                timecap: 30,
                type: 'event',
                rounds: [
                    {
                        type: 'not_timed',
                        numberOfRounds: 1,
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
            },
        ]

        expect(object).toMatchObject(expected)
    })

    it('2 blocks with header and rounds with header', () => {
        const text = `
		bloco: amrap 30
		2 rounds
		10 snatch 50kg

		10cal Bike
		-
		bloco: amrap 30s
		10 snatch 50kg
		`

        const object = sectionTransformer.toObject(text)

        const expected: IBlock[] = [
            {
                event_type: 'amrap',
                numberOfRounds: 1,
                timecap: 30,
                type: 'event',
                rounds: [
                    {
                        type: 'not_timed',
                        numberOfRounds: 2,
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
                    {
                        type: 'not_timed',
                        numberOfRounds: 1,
                        movements: [
                            {
                                name: 'Bike',
                                reps: '10cal',
                            },
                        ],
                    },
                ],
            },
            {
                event_type: 'amrap',
                numberOfRounds: 1,
                timecap: 30,
                type: 'event',
                rounds: [
                    {
                        type: 'not_timed',
                        numberOfRounds: 1,
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
            },
        ]

        expect(object).toMatchObject(expected)
    })

    it('2 blocks with 1 text block', () => {
        const text = `bloco: amrap 30
		2 rounds
		10 snatch 50kg
		-
		texto qualquer
		`

        const object = sectionTransformer.toObject(text)

        const expected: IBlock[] = [
            {
                event_type: 'amrap',
                numberOfRounds: 1,
                timecap: 30,
                type: 'event',
                rounds: [
                    {
                        type: 'not_timed',
                        numberOfRounds: 2,
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
            },
            {
                type: 'text',
                text: 'texto qualquer',
            },
        ]

        expect(object).toMatchObject(expected)
    })
})
