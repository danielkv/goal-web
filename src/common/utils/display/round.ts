import { IRound, IRoundEMOM, IRoundTabata, IRoundTimecap } from '@models/block'
import { roundTypes } from '@utils/worksheetInitials'

import { BaseDisplay } from './base'
import { MovementDisplay, movementDisplay } from './movement'

export class RoundDisplay extends BaseDisplay {
    private complexSplit = ' + '

    constructor(private movementDisplay: MovementDisplay) {
        super()
    }

    displayRestRound(obj: IRound): string {
        if (obj.type !== 'rest') return ''

        return super.displayRest(obj.time)
    }

    displayComplex(obj: IRound): string {
        if (obj.type !== 'complex') return ''

        const complex = obj.movements.map((m) => this.movementDisplay.displayMovement(m)).join(this.complexSplit)
        const weight = this.movementDisplay.displayWeight(obj.movements[0].weight)

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

export const roundDisplay = new RoundDisplay(movementDisplay)
