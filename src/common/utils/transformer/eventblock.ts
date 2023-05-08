import { IEventBlock, IRound, TEventType } from '@models/block'
import { pluralize } from '@utils/strings'
import { getTimeFromSeconds } from '@utils/time'
import { eventTypes } from '@utils/worksheetInitials'

import { BaseTransformer } from './base'
import { RoundTransformer, roundTransformer } from './round'

type TEventTypeTransform = 'emom' | 'for time' | 'max' | 'amrap' | 'tabata'

export class EventBlockTransformer extends BaseTransformer {
    private breakline = '\n\n'
    constructor(private roundTransformer: RoundTransformer) {
        super()
    }

    toObject(text: string): IEventBlock | null {
        const regex = /^bloco\:\s(?<rounds>\d+)(?:\s(?<type>emom|for time|max|amrap|tabata)(?:\s(?<time>.*))?)?/i
        const match = text.match(regex)

        if (match?.groups) {
            const textRounds = text.replace(match[0], '').trim().split(this.breakline)
            if (!textRounds.length) return null

            const rounds = textRounds.map((t) => this.roundTransformer.toObject(t)).filter((r) => r) as IRound[]

            const event_type = this.tranformEventType(match.groups.type as TEventTypeTransform)

            switch (event_type) {
                case 'tabata': {
                    const time = this.extractTimeByType(event_type, match.groups.time)

                    return {
                        type: 'event',
                        numberOfRounds: Number(match.groups.rounds),
                        event_type,
                        rest: time[1],
                        work: time[1],
                        rounds,
                    }
                }
                case 'emom': {
                    const time = this.extractTimeByType(event_type, match.groups.time)

                    return {
                        type: 'event',
                        numberOfRounds: Number(match.groups.rounds),
                        event_type,
                        each: time,
                        rounds,
                    }
                }
                case 'not_timed': {
                    return {
                        type: 'event',
                        numberOfRounds: Number(match.groups.rounds),
                        event_type,
                        rounds,
                    }
                }
                default: {
                    const time = this.extractTimeByType(
                        event_type === 'max_weight' ? 'for_time' : event_type,
                        match.groups.time
                    )

                    return {
                        type: 'event',
                        numberOfRounds: Number(match.groups.rounds),
                        event_type,
                        timecap: time,
                        rounds,
                    }
                }
            }
        }
        const textRounds = text.split(this.breakline)
        if (!textRounds.length) return null
        const rounds = textRounds.map((t) => this.roundTransformer.toObject(t)).filter((r) => r) as IRound[]

        return {
            type: 'event',
            event_type: 'not_timed',
            rounds,
        }
    }

    toString(obj: IEventBlock): string {
        let text = obj.numberOfRounds ? `bloco: ${obj.numberOfRounds}` : ''
        const timeString = this.eventTimeToString(obj)
        if (text && timeString) text += ` ${this.eventTypeToString(obj.event_type)} ${timeString}`
        if (text) text += '\n'
        text += obj.rounds.map((o) => this.roundTransformer.toString(o)).join(this.breakline)
        return text
    }

    private eventTimeToString(obj: IEventBlock): string | null {
        switch (obj.event_type) {
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
            case 'amrap':
            case 'max_weight': {
                const time = getTimeFromSeconds(obj.timecap)
                return time
            }
            default:
                return null
        }
    }

    private tranformEventType(type?: TEventTypeTransform): TEventType {
        if (!type) return 'not_timed'
        if (type === 'max') return 'max_weight'
        if (type === 'for time') return 'for_time'

        return type
    }

    private eventTypeToString(type: TEventType): TEventTypeTransform | '' {
        if (!type || type === 'not_timed') return ''
        if (type === 'max_weight') return 'max'
        if (type === 'for_time') return 'for time'

        return type
    }

    displayType(block: IEventBlock): string {
        if (block.event_type === 'emom') {
            if (!block.each || !block.numberOfRounds) return ''
            const each = getTimeFromSeconds(block.each)
            return ` - Cada ${each} por ${block.numberOfRounds} ${pluralize(block.numberOfRounds, 'round')}`
        }

        if (block.event_type === 'tabata') {
            if (!block.work || !block.rest || !block.numberOfRounds) return ''
            const work = getTimeFromSeconds(block.work)
            const rest = getTimeFromSeconds(block.rest)
            return ` - ${work}/${rest} por ${block.numberOfRounds} ${pluralize(block.numberOfRounds, 'round')}`
        }

        if (block.event_type === 'not_timed') return ''

        if (!block.timecap) return ''

        const timecap = getTimeFromSeconds(block.timecap)
        const numberOfRounds = block.numberOfRounds && block.numberOfRounds > 1 ? `${block.numberOfRounds} rounds` : ''
        return `${numberOfRounds} ${eventTypes[block.event_type]} - ${timecap}`
    }
}

export const eventBlockTransformer = new EventBlockTransformer(roundTransformer)
