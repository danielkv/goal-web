import { IRound, IRoundEMOM, IRoundRest, IRoundTabata, IRoundTimecap } from '@models/block'
import { TTimerType } from '@models/time'
import { pluralize } from '@utils/strings'
import { getTimeFromSeconds } from '@utils/time'
import { roundTypes } from '@utils/worksheetInitials'

import { BaseTransformer } from './base'
import { MovementTransformer, movementTransformer } from './movement'

type TRoundTypeTransform = 'emom' | 'for time' | 'amrap' | 'tabata'

export class RoundTransformer extends BaseTransformer {
    private breakline = '\n'
    private complexSplit = ' + '
    constructor(private movementTransformer: MovementTransformer) {
        super()
    }

    toObject(text: string): IRound | null {
        const regex = /^round\:\s(?<rounds>\d+)(?:\s(?<type>emom|for time|amrap|tabata)(?:\s(?<time>.*))?)?/i
        const match = text.match(regex)

        if (match?.groups) {
            const extractedText = text.replace(match[0], '').trim()

            const restRound = this.checkRestRound(extractedText)
            if (restRound) return { ...restRound, movements: [] }

            const extractedMovements = this.textMovementsToRound(extractedText)
            if (!extractedMovements) return null

            const type =
                extractedMovements.type === 'complex'
                    ? 'complex'
                    : this.tranformType(match.groups.type as TRoundTypeTransform)

            switch (type) {
                case 'tabata': {
                    const time = this.extractTime(type, match.groups.time)

                    return {
                        type,
                        numberOfRounds: Number(match.groups.rounds),
                        rest: time[1],
                        work: time[1],
                        movements: extractedMovements.movements,
                    }
                }
                case 'emom': {
                    const time = this.extractTime(type, match.groups.time)

                    return {
                        type,
                        numberOfRounds: Number(match.groups.rounds),
                        each: time,
                        movements: extractedMovements.movements,
                    }
                }
                case 'not_timed':
                case 'complex': {
                    return {
                        type,
                        numberOfRounds: Number(match.groups.rounds),
                        movements: extractedMovements.movements,
                    }
                }
                default: {
                    const time = this.extractTime(type, match.groups.time)

                    return {
                        type,
                        numberOfRounds: Number(match.groups.rounds),
                        timecap: time,
                        movements: extractedMovements.movements,
                    }
                }
            }
        }

        const restRound = this.checkRestRound(text)
        if (restRound) return { ...restRound, movements: [] }

        return this.textMovementsToRound(text)
    }

    toString(obj: IRound): string {
        if (obj.type === 'rest') return this.displayRest(obj.time)

        if (obj.type === 'complex') return this.displayComplex(obj)

        let text = obj.numberOfRounds ? `round: ${obj.numberOfRounds}` : ''

        const timeString = this.eventTimeToString(obj)
        if (text && timeString) text += ` ${this.typeToString(obj.type)} ${timeString}`
        if (text) text += '\n'
        text += obj.movements.map((o) => this.movementTransformer.toString(o)).join(this.breakline)
        return text
    }

    private textMovementsToRound(text: string): IRound | null {
        const complexRegex =
            /^(?<movements>(?:(?:\d+(?:[\d\-\*\,\/\sa\?]*)?)?)+(?<name>[a-zA-Z\u00C0-\u00FF\s\'\d\+]+[A-Z])+)(?<weight>(?:\s\-\s((?:\d+(?:[\d\-\*\,\/\sa\?]*(?:\d|\?))?)?)(?<weight_type>kg|%|lb)+)?)$/i

        const textMovements = text.split(this.breakline)
        if (!textMovements.length) return null

        if (textMovements.length === 1) {
            const textToMatch = textMovements[0]
            const match = textToMatch.match(complexRegex)

            if (match?.groups?.movements) {
                const complexMovements = match?.groups?.movements.split(this.complexSplit)
                if (complexMovements.length > 1)
                    return {
                        type: 'complex',
                        movements: complexMovements.map((movement) => {
                            const movementText = `${movement}${match.groups?.weight || ''}`
                            return this.movementTransformer.toObject(movementText)
                        }),
                    }
            }
        }

        return {
            type: 'not_timed',
            movements: textMovements.map((movement) => this.movementTransformer.toObject(movement)),
        }
    }

    private checkRestRound(text: string): IRoundRest | null {
        const match = text.match(this.restRegex)
        if (!match?.groups?.time) return null

        const time = this.extractTime('for_time', match.groups.time)

        return {
            type: 'rest',
            time,
        }
    }

    private eventTimeToString(obj: IRound): string | null {
        switch (obj.type) {
            case 'tabata': {
                const work = getTimeFromSeconds(obj.work)
                const rest = getTimeFromSeconds(obj.rest)
                return `${work}/${rest}`
            }
            case 'emom': {
                const each = getTimeFromSeconds(obj.each)
                return each
            }
            case 'for_time':
            case 'amrap': {
                const time = getTimeFromSeconds(obj.timecap)
                return time
            }
            default:
                return null
        }
    }

    private tranformType(type?: TRoundTypeTransform): TTimerType {
        if (!type) return 'not_timed'
        if (type === 'for time') return 'for_time'

        return type
    }

    private typeToString(type: TTimerType): TRoundTypeTransform | '' {
        if (!type || type === 'not_timed') return ''
        if (type === 'for_time') return 'for time'

        return type
    }

    displayRestRound(obj: IRound): string {
        if (obj.type !== 'rest') return ''

        return super.displayRest(obj.time)
    }

    displayComplex(obj: IRound): string {
        if (obj.type !== 'complex') return ''

        const complex = obj.movements.map((m) => this.movementTransformer.displayMovement(m)).join(this.complexSplit)
        const weight = this.movementTransformer.displayWeight(obj.movements[0].weight)

        return `${complex}${weight}`
    }

    displayType(round: IRound): string {
        if (round.type === 'rest') return ''
        if (round.type === 'complex') return ''
        const time =
            round.type === 'amrap' || round.type === 'for_time' || round.type === 'emom' ? this.displayTime(round) : ''

        const numberOfRounds = round.numberOfRounds && round.numberOfRounds > 1 ? `${round.numberOfRounds} rounds` : ''
        const type = round.type && round.type != 'not_timed' ? roundTypes[round.type] : ''
        if (!numberOfRounds && !type) return ''
        return `${numberOfRounds} ${type}${time}`.trim()
    }

    private displayTime(round: IRoundTimecap | IRoundEMOM | IRoundTabata): string {
        if (round.type === 'emom') {
            if (!round.each || !round.numberOfRounds) return ''
            const each = getTimeFromSeconds(round.each)
            return ` - Cada ${each} por ${round.numberOfRounds} ${pluralize(round.numberOfRounds, 'round')}`
        }

        if (round.type === 'tabata') {
            if (!round.work || !round.rest || !round.numberOfRounds) return ''
            const work = getTimeFromSeconds(round.work)
            const rest = getTimeFromSeconds(round.rest)
            return ` - ${work}/${rest} por ${round.numberOfRounds} ${pluralize(round.numberOfRounds, 'round')}`
        }

        const timecap = getTimeFromSeconds(round.timecap)

        return ` - ${timecap}`
    }
}

export const roundTransformer = new RoundTransformer(movementTransformer)
