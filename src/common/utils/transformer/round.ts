import cloneDeep from 'clone-deep'
import { omit } from 'radash'

import { IEventMovement, IRound, IRoundEMOM, IRoundTabata, IRoundTimecap } from '@models/block'
import { TMergedTimer } from '@models/time'
import { roundTypes } from '@utils/worksheetInitials'

import { numberHelper } from '../numbers'

import { BaseTransformer } from './base'
import { MovementTransformer, movementTransformer } from './movement'

export class RoundTransformer extends BaseTransformer {
    private breakline = '\n'
    private complexSplit = ' + '

    constructor(private movementTransformer: MovementTransformer) {
        super()
    }

    toObject(text: string, numberOfRounds?: number): IRound | null {
        const textMovements = this.breakTextInMovements(text)
        if (!textMovements) return null

        const extractedHeader = this.extractTimerFromString(textMovements[0].trim())
        const finalNumberOfRounds = numberOfRounds || extractedHeader?.numberOfRounds || 1

        if (extractedHeader) {
            textMovements.splice(0, 1)

            const restRoundTime = this.findRest(text)
            if (restRoundTime) return { type: 'rest', time: restRoundTime, movements: [] }

            const extractedRound = this.textMovementsToRound(textMovements, extractedHeader.reps)
            if (!extractedRound) return null
            return {
                ...omit(extractedHeader, ['reps', 'numberOfRounds']),
                numberOfRounds: finalNumberOfRounds,
                ...extractedRound,
                type: extractedRound.type === 'complex' ? 'complex' : extractedHeader.type,
            } as IRound
        }

        const restRoundTime = this.findRest(text)
        if (restRoundTime) return { type: 'rest', time: restRoundTime, movements: [] }

        const round = this.textMovementsToRound(textMovements)
        if (!round) return null

        return {
            ...round,
            numberOfRounds: finalNumberOfRounds,
        }
    }

    toString(obj: IRound): string {
        if (obj.type === 'rest') return this.displayRest(obj.time)

        const matchingReps = this.findSequenceReps(obj.movements)

        const title = this.headerToString(obj, matchingReps)

        if (obj.type === 'complex') {
            if (title) return `${title}\n${this.complexToString(obj, !!matchingReps)}`
            return this.complexToString(obj)
        }

        const round = cloneDeep(obj)

        const movements = round.movements
            .map((o) => this.movementTransformer.toString(o, !!matchingReps))
            .join(this.breakline)

        return this.displayArray([title, movements], '\n')
    }

    findSequenceReps(movements: IEventMovement[]): string | null {
        const compareReps = movements[0]?.reps
        if (!compareReps) return null

        if (!compareReps.includes('-')) return null

        const match = compareReps.match(numberHelper.sequenceRegex)
        if (!match) return null

        if (movements.length === 1) return compareReps

        if (!movements.every((movement) => movement.reps === compareReps)) return null

        return compareReps
    }

    private headerToString(obj: IRound, sequence?: string | null): string | null {
        if (obj.type === 'rest') return null

        if (obj.type === 'complex') {
            if (sequence) return sequence

            const displayRounds = super.displayNumberOfRounds(obj.numberOfRounds)
            if (!displayRounds) return null
            return displayRounds
        }

        return this.timerToString(obj.type, obj as TMergedTimer, sequence)
    }

    private breakTextInMovements(text: string): string[] | null {
        const textMovements = text.split(this.breakline)
        if (!textMovements.length) return null

        return textMovements
    }

    private textMovementsToRound(textMovements: string[], roundReps?: string): IRound | null {
        if (textMovements.length === 1) {
            const match = textMovements[0].trim().match(this.weightBaseRegex)
            const complexMovementsText = match?.groups?.movement || textMovements[0].trim()

            const complexMovements = complexMovementsText.split(this.complexSplit)
            const weightText = match?.groups?.weight ? ` ${match.groups.weight.trim()}` : ''

            if (complexMovements.length > 1) {
                return {
                    type: 'complex',
                    movements: complexMovements.map((movement) => {
                        const movementText = `${movement.trim()}${weightText}`

                        return this.movementTransformer.toObject(movementText, roundReps)
                    }),
                }
            }
        }

        const movements = textMovements.map((movement) => this.movementTransformer.toObject(movement, roundReps))

        const round: IRound = {
            type: 'not_timed',
            movements,
        }

        if (roundReps) return round

        const sequenceReps = this.findSequenceReps(movements)
        if (sequenceReps) round.numberOfRounds = sequenceReps.length

        return round
    }

    displayRestRound(obj: IRound): string {
        if (obj.type !== 'rest') return ''

        return super.displayRest(obj.time)
    }

    displayComplex(obj: IRound): string {
        if (obj.type !== 'complex') return ''

        const complex = obj.movements.map((m) => this.movementTransformer.displayMovement(m)).join(this.complexSplit)
        const weight = this.movementTransformer.displayWeight(obj.movements[0].weight)

        return this.displayArray([complex, weight])
    }

    private complexToString(obj: IRound, hideReps?: boolean): string {
        if (obj.type !== 'complex') return ''

        const complex = obj.movements
            .map((m) => this.movementTransformer.displayMovement(m, hideReps))
            .join(this.complexSplit)
        const weight = this.movementTransformer.weightToString(obj.movements[0].weight)

        return this.displayArray([complex, weight])
    }

    displayTitle(round: IRound, roundReps?: string | null): string {
        if (round.type === 'rest') return ''
        if (round.type === 'complex') return super.displayNumberOfRounds(round.numberOfRounds)
        const time =
            round.type === 'amrap' || round.type === 'for_time' || round.type === 'emom' || round.type === 'tabata'
                ? this.displayRoundTimer(round) || ''
                : ''

        const numberOfRounds = roundReps ? roundReps : !time ? super.displayNumberOfRounds(round.numberOfRounds) : ''

        const type = round.type && round.type != 'not_timed' ? roundTypes[round.type] : ''

        return this.displayArray([numberOfRounds, type, time])
    }

    private displayRoundTimer(round: IRoundTimecap | IRoundEMOM | IRoundTabata): string {
        switch (round.type) {
            case 'emom':
                return super.displayTimer('emom', round.numberOfRounds, round.each)
            case 'tabata':
                return super.displayTimer('tabata', round.numberOfRounds, round.work, round.rest)
            default:
                return super.displayTimer(round.type, round.numberOfRounds, round.timecap)
        }
    }
}

export const roundTransformer = new RoundTransformer(movementTransformer)
