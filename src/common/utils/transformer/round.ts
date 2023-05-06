import { IRound } from '@models/block'
import { TTimerType } from '@models/time'
import { getTimeFromSeconds } from '@utils/time'

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

        console.log(match)

        if (match?.groups) {
            const textMovements = text.replace(match[0], '').trim().split(this.breakline)
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

        const textMovements = text.split(this.breakline)
        const movements = textMovements.map((t) => this.movementTransformer.toObject(t))

        return {
            type: 'not_timed',
            movements,
        }
    }

    toString(obj: IRound): string {
        if (obj.type === 'rest') return ''

        let text = obj.numberOfRounds ? `round: ${obj.numberOfRounds}` : ''

        const timeString = this.eventTimeToString(obj)
        if (text && timeString) text += ` ${this.typeToString(obj.type)} ${timeString}`
        if (text) text += '\n'
        text += obj.movements.map((o) => this.movementTransformer.toString(o)).join(this.breakline)
        return text
    }

    // toString(obj: IEventBlock): string {
    //     let text = obj.numberOfRounds ? `bloco: ${obj.numberOfRounds}` : ''
    //     const timeString = this.eventTimeToString(obj)
    //     if (text && timeString) text += ` ${this.typeToString(obj.event_type)} ${timeString}`
    //     if (text) text += '\n'
    //     text += obj.rounds.map((o) => this.roundTransformer.toString(o)).join(this.breakline)
    //     return text
    // }

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
}

export const roundTransformer = new RoundTransformer(movementTransformer)
