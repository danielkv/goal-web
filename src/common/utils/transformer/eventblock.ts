import { omit } from 'radash'

import { IEventBlock, IEventBlockEMOM, IEventBlockTabata, IEventBlockTimecap, IRound, TEventType } from '@models/block'
import { eventTypes } from '@utils/worksheetInitials'

import { BaseTransformer } from './base'
import { RoundTransformer, roundTransformer } from './round'

type TEventTypeTransform = 'emom' | 'for time' | 'max' | 'amrap' | 'tabata'

export class EventBlockTransformer extends BaseTransformer {
    private breakline = '\n\n'
    private blockHeaderRegex = this.mergeRegex(['^(bloco:\\s+', '(?<header>', this.headerRegex, ')', ')$'], 'i')
    constructor(private roundTransformer: RoundTransformer) {
        super()
    }

    protected override extractTimerFromString(text: string) {
        const match = text.match(this.blockHeaderRegex)
        if (!match?.groups?.header) return null

        return super.extractTimerFromString(match.groups.header)
    }

    toObject(text: string): IEventBlock | null {
        const headerBreak = text.split('\n')
        if (!headerBreak) return null

        const extractedHeader = this.extractTimerFromString(headerBreak[0].trim())

        if (extractedHeader) {
            headerBreak.splice(0, 1)
            const textRounds = headerBreak.join('\n').split(this.breakline)

            const rounds = textRounds.map((t) => this.roundTransformer.toObject(t)).filter((r) => r) as IRound[]

            return {
                ...omit(extractedHeader, ['reps', 'type']),
                event_type: extractedHeader.type,
                type: 'event',
                rounds,
            } as IEventBlock
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
        const title = this.titleToString(obj)

        let text = title || ''
        if (text) text += '\n'

        text += obj.rounds.map((o) => this.roundTransformer.toString(o)).join(this.breakline)

        if (!text) return ''

        return text
    }

    private titleToString(obj: IEventBlock): string | null {
        const rounds = obj.numberOfRounds && obj.numberOfRounds > 1 ? ` ${obj.numberOfRounds}` : null

        const type = this.typeToString(obj.event_type)
        const timeString = this.eventTimerToString(obj)

        if (!rounds && !type) return null

        return `bloco:${rounds || ''}${type ? ` ${type}` : ''}${timeString ? ` ${timeString}` : ''}`
    }

    private typeToString(type: TEventType): TEventTypeTransform | '' {
        if (!type || type === 'not_timed') return ''
        if (type === 'max_weight') return 'max'
        if (type === 'for_time') return 'for time'

        return type
    }

    displayTitle(block: IEventBlock): string {
        const time =
            block.event_type === 'amrap' ||
            block.event_type === 'for_time' ||
            block.event_type === 'emom' ||
            block.event_type === 'max_weight' ||
            block.event_type === 'tabata'
                ? this.displayEventTimer(block) || ''
                : ''

        const numberOfRounds = !time ? super.displayNumberOfRounds(block.numberOfRounds, 'x', 'Repetir') : ''
        const type = block.event_type && block.event_type != 'not_timed' ? eventTypes[block.event_type] : ''

        if (!numberOfRounds && !type) return ''
        return this.displayArray([numberOfRounds, type, time])
    }

    private eventTimerToString(obj: IEventBlock): string | null {
        switch (obj.event_type) {
            case 'tabata': {
                return super.timerToString('tabata', obj.work, obj.rest)
            }
            case 'emom': {
                return super.timerToString('emom', obj.each)
            }
            case 'for_time':
            case 'amrap':
            case 'max_weight': {
                return super.timerToString('emom', obj.timecap)
            }
            default:
                return super.timerToString('not_timed')
        }
    }

    private displayEventTimer(block: IEventBlockTimecap | IEventBlockEMOM | IEventBlockTabata): string {
        switch (block.event_type) {
            case 'emom':
                return super.displayTimer('emom', block.numberOfRounds, block.each)
            case 'tabata':
                return super.displayTimer('tabata', block.numberOfRounds, block.work, block.rest)
            case 'max_weight':
                return super.displayTimer('for_time', block.numberOfRounds, block.timecap)
            default:
                return super.displayTimer(block.event_type, block.numberOfRounds, block.timecap)
        }
    }
}

export const eventBlockTransformer = new EventBlockTransformer(roundTransformer)
