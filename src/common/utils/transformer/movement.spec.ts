import { describe, expect, it } from 'vitest'

import { IEventMovement } from '@models/block'

import { movementTransformer } from './movement'

describe('Movement transformer toObject', () => {
    it('10   Snatch 50kg', () => {
        const text = `10   Snatch 50kg`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '10',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)
    })

    it('10 Snatch - DB Clean Jerk    50kg', () => {
        const text = `10 Snatch - DB Clean Jerk    50kg`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Snatch - DB Clean Jerk',
            reps: '10',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)
    })

    it('Snatch 50kg', () => {
        const text = `Snatch 50kg`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)
    })

    it('Snatch', () => {
        const text = `Snatch`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '',
        }

        expect(object).toMatchObject(expected)
    })
    it('3x Snatch 50%', () => {
        const text = `3x Snatch 50%`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '3x',
            weight: {
                type: '%',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)
    })
    it('3 Hang Snatch 30lb', () => {
        const text = `3 Hang Snatch 30lb`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Hang Snatch',
            reps: '3',
            weight: {
                type: 'lb',
                value: '30',
            },
        }

        expect(object).toMatchObject(expected)
    })
    it('8x Pull-up', () => {
        const text = `8x Pull-up 60lb`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Pull-up',
            reps: '8x',
            weight: {
                type: 'lb',
                value: '60',
            },
        }

        expect(object).toMatchObject(expected)
    })
    it('10/8 Snatch 50kg', () => {
        const text = `10/8 Snatch 50kg`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '10/8',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)
    })

    it('10 Snatch 50/40%', () => {
        const text = `10 Snatch 50/40%`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '10',
            weight: {
                type: '%',
                value: '50/40',
            },
        }

        expect(object).toMatchObject(expected)
    })
    it('2-5-6 Snatch / Hang Snatch 50kg', () => {
        const text = `2-5-6 Snatch / Hang Snatch 50kg`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Snatch / Hang Snatch',
            reps: '2-5-6',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)
    })
    it('10/8-8/6-6/4 DB Snatch 20/15kg', () => {
        const text = `10/8-8/6-6/4 DB Snatch 20/15kg`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'DB Snatch',
            reps: '10/8-8/6-6/4',
            weight: {
                type: 'kg',
                value: '20/15',
            },
        }

        expect(object).toMatchObject(expected)
    })
    it('10cal Assault Bike', () => {
        const text = `10cal Assault Bike`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Assault Bike',
            reps: '10cal',
        }

        expect(object).toMatchObject(expected)
    })

    it('max Assault Bike', () => {
        const text = `max Assault Bike`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Assault Bike',
            reps: 'max',
        }

        expect(object).toMatchObject(expected)
    })

    it('1º 30s Box step', () => {
        const text = `1º 30s Box step`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Box step',
            reps: '1º 30s',
        }

        expect(object).toMatchObject(expected)
    })

    it('10cal Assault Bike / 2cal Rino Bike', () => {
        const text = `10cal Assault Bike / 2cal Rino Bike`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Assault Bike / 2cal Rino Bike',
            reps: '10cal',
        }

        expect(object).toMatchObject(expected)
    })

    it('max Assault Bike:https://www.youtube.com...', () => {
        const text = `max Assault Bike:https://www.youtube.com/watch?v=ivDB23Kcv-A&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Assault Bike',
            reps: 'max',
            videoUrl: 'https://www.youtube.com/watch?v=ivDB23Kcv-A&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4',
        }

        expect(object).toMatchObject(expected)
    })

    it('10/8 Deadlift 70%: https://www.youtube.com...', () => {
        const text = `10/8 Deadlift 70%: https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Deadlift',
            reps: '10/8',
            videoUrl: 'https://www.youtube.com/watch?v=1ZXobu7JvvE&list=PLdWvFCOAvyr3EWQhtfcEMd3DVM5sJdPL4',
            weight: {
                type: '%',
                value: '70',
            },
        }

        expect(object).toMatchObject(expected)
    })
})
