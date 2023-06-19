import { describe, expect, it } from 'vitest'

import { IEventMovement } from '@models/block'

import { movementTransformer } from './movement'

describe('Movement transformer toObject', () => {
    it('Simple movement text', () => {
        expect(1).toBeTruthy()

        const text = `10 Snatch 50kg`

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

    it('Text with Male/Female weight', () => {
        expect(1).toBeTruthy()

        const text = `10 Snatch 50/30kg`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '10',
            weight: {
                type: 'kg',
                value: '50/30',
            },
        }

        expect(object).toMatchObject(expected)
    })

    it('Text with Male/Female reps', () => {
        expect(1).toBeTruthy()

        const text = `10/5 Snatch 50kg`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: 'Snatch',
            reps: '10/5',
            weight: {
                type: 'kg',
                value: '50',
            },
        }

        expect(object).toMatchObject(expected)
    })

    it('Unmatched Exercise', () => {
        expect(1).toBeTruthy()

        const text = `10cal Assault Bike / 2cal Rino Bike`

        const object = movementTransformer.toObject(text)

        const expected: IEventMovement = {
            name: '10cal Assault Bike / 2cal Rino Bike',
            reps: '',
        }

        expect(object).toMatchObject(expected)
    })
})
