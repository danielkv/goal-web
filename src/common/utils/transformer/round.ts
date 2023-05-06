import { IRound, IRoundRest } from '@models/block'
import { TTimerType } from '@models/time'
import { pluralize } from '@utils/strings'
import { getTimeFromSeconds } from '@utils/time'
import { roundTypes } from '@utils/worksheetInitials'

import { BaseTransformer } from './base'
import { MovementTransformer, movementTransformer } from './movement'

type TRoundTypeTransform = 'emom' | 'for time' | 'amrap' | 'tabata'

export class RoundTransformer extends BaseTransformer {
    private breakline = '\n'
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

            const textMovements = extractedText.split(this.breakline)
            if (!textMovements.length) return null

            const movements = textMovements.map((t) => this.movementTransformer.toObject(t))

            const type = this.tranformType(match.groups.type as TRoundTypeTransform)

            switch (type) {
                case 'tabata': {
                    const time = this.extractTime(type, match.groups.time)

                    return {
                        type,
                        numberOfRounds: Number(match.groups.rounds),
                        rest: time[1],
                        work: time[1],
                        movements,
                    }
                }
                case 'emom': {
                    const time = this.extractTime(type, match.groups.time)

                    return {
                        type,
                        numberOfRounds: Number(match.groups.rounds),
                        each: time,
                        movements,
                    }
                }
                case 'not_timed': {
                    return {
                        type,
                        numberOfRounds: Number(match.groups.rounds),
                        movements,
                    }
                }
                default: {
                    const time = this.extractTime(type, match.groups.time)

                    return {
                        type,
                        numberOfRounds: Number(match.groups.rounds),
                        timecap: time,
                        movements,
                    }
                }
            }
        }

        const restRound = this.checkRestRound(text)
        if (restRound) return { ...restRound, movements: [] }

        const textMovements = text.split(this.breakline)
        const movements = textMovements.map((t) => this.movementTransformer.toObject(t))

        return {
            type: 'not_timed',
            movements,
        }
    }

    toString(obj: IRound): string {
        if (obj.type === 'rest') return this.displayRest(obj.time)

        let text = obj.numberOfRounds ? `round: ${obj.numberOfRounds}` : ''

        const timeString = this.eventTimeToString(obj)
        if (text && timeString) text += ` ${this.typeToString(obj.type)} ${timeString}`
        if (text) text += '\n'
        text += obj.movements.map((o) => this.movementTransformer.toString(o)).join(this.breakline)
        return text
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

    display(obj: IRound): string {
        if (obj.type !== 'rest') return ''

        return this.displayRest(obj.time)
    }

    displayType(round: IRound): string {
        if (round.type === 'rest') return ''
        const time = this.displayTime(round)
        const numberOfRounds = round.numberOfRounds && round.numberOfRounds > 1 ? `${round.numberOfRounds} rounds` : ''
        const type = round.type && round.type != 'not_timed' ? roundTypes[round.type] : ''
        if (!numberOfRounds && !type) return ''
        return `${numberOfRounds} ${type}${time}`.trim()
    }

    private displayTime(round: IRound): string {
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

        if (round.type === 'not_timed') return ''
        if (round.type === 'rest') return ''
        if (!round.type) return ''

        const timecap = getTimeFromSeconds(round.timecap)

        return ` - ${timecap}`
    }
}

export const roundTransformer = new RoundTransformer(movementTransformer)
