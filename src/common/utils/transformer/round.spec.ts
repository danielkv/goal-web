import { describe, expect, it } from 'vitest'

import { IRound } from '@models/block'

import { roundTransformer } from './round'

describe('Round transformer toObject', () => {
    describe('Header and Movements', () => {
        it('3 movements no header', () => {
            const text = `10 Snatch - DB Clean Jerk    50kg
		Snatch 50kg
		Snatch`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'not_timed',
                movements: [
                    {
                        name: 'Snatch - DB Clean Jerk',
                        reps: '10',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                    {
                        name: 'Snatch',
                        reps: '',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                    {
                        name: 'Snatch',
                        reps: '',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('2 movements no header', () => {
            const text = `5 Muscle Clean 50%
			10 Pull-Up`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'not_timed',
                movements: [
                    {
                        name: 'Muscle Clean',
                        reps: '5',
                        weight: {
                            type: '%',
                            value: '50',
                        },
                    },
                    {
                        name: 'Pull-Up',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('2 movements with header "1 for time"', () => {
            const text = `1 for time
		5 Muscle Clean 50%
		10 Pull-Up`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'for_time',
                numberOfRounds: 1,
                timecap: 0,
                movements: [
                    {
                        name: 'Muscle Clean',
                        reps: '5',
                        weight: {
                            type: '%',
                            value: '50',
                        },
                    },
                    {
                        name: 'Pull-Up',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "2 fortime 3min"', () => {
            const text = `2 fortime 3min
		10 Pull-Up`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'for_time',
                numberOfRounds: 2,
                timecap: 180,
                movements: [
                    {
                        name: 'Pull-Up',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "4x amrap 3min"', () => {
            const text = `4x amrap 3min
		10 Pull-Up`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'amrap',
                numberOfRounds: 4,
                timecap: 180,
                movements: [
                    {
                        name: 'Pull-Up',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "4 rounds amrap 30s"', () => {
            const text = `4 rounds amrap 30s
		10 Pull-Up`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'amrap',
                numberOfRounds: 4,
                timecap: 30,
                movements: [
                    {
                        name: 'Pull-Up',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "emom 30 1m30s"', () => {
            const text = `emom 30 1m30s
		10 Pull-Up`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'emom',
                numberOfRounds: 30,
                each: 90,
                movements: [
                    {
                        name: 'Pull-Up',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "emom 4 rounds 1min34s"', () => {
            const text = `emom 4 rounds 1min34s
		10 Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'emom',
                numberOfRounds: 4,
                each: 94,
                movements: [
                    {
                        name: 'Hang Clean',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "emom 4 30"', () => {
            const text = `emom 4 30
		10 Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'emom',
                numberOfRounds: 4,
                each: 30,
                movements: [
                    {
                        name: 'Hang Clean',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "emom 40min"', () => {
            const text = `emom 40min
		10 Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'emom',
                numberOfRounds: 40,
                each: 60,
                movements: [
                    {
                        name: 'Hang Clean',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "tabata 4 rounds 20s/10s"', () => {
            const text = `tabata 4 rounds 20s/10s
		10 Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'tabata',
                numberOfRounds: 4,
                work: 20,
                rest: 10,
                movements: [
                    {
                        name: 'Hang Clean',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "tabata 4 rounds 20/10"', () => {
            const text = `tabata 4 rounds 20/10
		10 Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'tabata',
                numberOfRounds: 4,
                work: 20,
                rest: 10,
                movements: [
                    {
                        name: 'Hang Clean',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "tabata 4 rounds"', () => {
            const text = `tabata 4 rounds
		10 Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'tabata',
                numberOfRounds: 4,
                work: 20,
                rest: 10,
                movements: [
                    {
                        name: 'Hang Clean',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "tabata"', () => {
            const text = `tabata
		10 Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'tabata',
                numberOfRounds: 8,
                work: 20,
                rest: 10,
                movements: [
                    {
                        name: 'Hang Clean',
                        reps: '10',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "21-15-9 fortime"', () => {
            const text = `21-15-9 fortime
		Deadlift
		Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'for_time',
                numberOfRounds: 3,
                timecap: 0,
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '21-15-9',
                    },
                    {
                        name: 'Hang Clean',
                        reps: '21-15-9',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "21-15-9 fortime 5min"', () => {
            const text = `21-15-9 fortime 5min
			Deadlift
			Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'for_time',
                numberOfRounds: 3,
                timecap: 300,
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '21-15-9',
                    },
                    {
                        name: 'Hang Clean',
                        reps: '21-15-9',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('header "21-15-9"', () => {
            const text = `21-15-9
			Deadlift
			Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'not_timed',
                numberOfRounds: 3,
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '21-15-9',
                    },
                    {
                        name: 'Hang Clean',
                        reps: '21-15-9',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })
    })

    describe('Complex and Rest rounds', () => {
        it('2min rest"', () => {
            const text = `2min rest`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'rest',
                time: 120,
                movements: [],
            }
            expect(object).toMatchObject(expected)
        })

        it('rest `1min30s"', () => {
            const text = `1min30s rest`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'rest',
                time: 90,
                movements: [],
            }
            expect(object).toMatchObject(expected)
        })

        it('Deadlift + Hang Clean', () => {
            const text = `Deadlift + Hang Clean`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'complex',
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '',
                    },
                    {
                        name: 'Hang Clean',
                        reps: '',
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('Deadlift + Hang Clean 50kg', () => {
            const text = `Deadlift + Hang Clean  50kg`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'complex',
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                    {
                        name: 'Hang Clean',
                        reps: '',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('5 Deadlift + Hang Clean 50kg', () => {
            const text = `3 Deadlift + 2 Hang Clean 50kg`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'complex',
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '3',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                    {
                        name: 'Hang Clean',
                        reps: '2',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('3 Deadlift + 2 Hang Clean 50kg with header "3 rounds"', () => {
            const text = `3 rounds
			3 Deadlift + 2 Hang Clean 50kg`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'complex',
                numberOfRounds: 3,
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '3',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                    {
                        name: 'Hang Clean',
                        reps: '2',
                        weight: {
                            type: 'kg',
                            value: '50',
                        },
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })

        it('Deadlift + Hang Clean 50/40% with header "10-9-8-7-6-5-4-3-2-1"', () => {
            const text = `10-9-8-7-6-5-4-3-2-1x
			Deadlift + Hang Clean 50/40%`
            const object = roundTransformer.toObject(text)

            const expected: IRound = {
                type: 'complex',
                numberOfRounds: 10,
                movements: [
                    {
                        name: 'Deadlift',
                        reps: '10-9-8-7-6-5-4-3-2-1',
                        weight: {
                            type: '%',
                            value: '50/40',
                        },
                    },
                    {
                        name: 'Hang Clean',
                        reps: '10-9-8-7-6-5-4-3-2-1',
                        weight: {
                            type: '%',
                            value: '50/40',
                        },
                    },
                ],
            }
            expect(object).toMatchObject(expected)
        })
    })
})
