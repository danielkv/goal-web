import deepEqual from 'deep-equal'
import { omit } from 'radash'

import { IEventBlock, IEventBlockEMOM, IEventBlockTabata, IEventBlockTimecap, IRound } from '@models/block'
import { TMergedTimer } from '@models/time'
import { eventTypes } from '@utils/worksheetInitials'

import { BaseTransformer } from './base'
import { RoundTransformer, roundTransformer } from './round'

export class EventBlockTransformer extends BaseTransformer {
    private breakline = '\n\n'
    private blockHeaderRegex = this.mergeRegex(
        ['^bloco', '(?:\\:\\s+', '(?<header>', this.headerRegex, '))?', '(?:\\s*?\\:\\s*?(?<info>.+))?$'],
        'i'
    )
    constructor(private roundTransformer: RoundTransformer) {
        super()
    }

    private extractBlockHeader(text: string) {
        const match = text.match(this.blockHeaderRegex)

        if (!match) return null

        const info = match?.groups?.info?.trim()

        const timer = match?.groups?.header ? super.extractTimerFromString(match.groups.header) : null

        return {
            timer,
            info,
        }
    }

    toObject(text: string): IEventBlock | null {
        const normalizedText = this.normalizeText(text)
        const headerBreak = normalizedText.split('\n')
        if (!headerBreak) return null

        const extractedHeader = this.extractBlockHeader(headerBreak[0].trim())

        if (extractedHeader) {
            headerBreak.splice(0, 1)
            const textRounds = headerBreak.join('\n').split(this.breakline)

            if (!extractedHeader.timer)
                return {
                    type: 'event',
                    info: extractedHeader.info,
                    event_type: 'not_timed',
                    rounds: textRounds.map((t) => this.roundTransformer.toObject(t)).filter((r) => r) as IRound[],
                }

            const roundNumberOfRounds = extractedHeader.timer.reps?.split('-') || null
            const rounds = textRounds
                .flatMap((t) => {
                    if (roundNumberOfRounds)
                        return roundNumberOfRounds.map((numberOfRounds) =>
                            this.roundTransformer.toObject(t, Number(numberOfRounds))
                        )

                    return this.roundTransformer.toObject(t)
                })
                .filter((r) => r) as IRound[]

            return {
                ...omit(extractedHeader.timer, ['reps', 'type', 'numberOfRounds']),
                numberOfRounds: roundNumberOfRounds ? 1 : extractedHeader.timer.numberOfRounds,
                event_type: extractedHeader.timer.type,
                info: extractedHeader.info,
                type: 'event',
                rounds,
            } as IEventBlock
        }

        const textRounds = normalizedText.split(this.breakline)

        if (!textRounds.length) return null
        const rounds = textRounds.map((t) => this.roundTransformer.toObject(t)).filter((r) => r) as IRound[]

        return {
            type: 'event',
            event_type: 'not_timed',
            rounds,
        }
    }

    toString(obj: IEventBlock): string {
        const isSame =
            obj.rounds.length > 1 &&
            obj.rounds
                .map((r) => omit(r, ['numberOfRounds']))
                .every((round) => deepEqual(round, omit(obj.rounds[0], ['numberOfRounds'])))

        const sequence = isSame
            ? obj.rounds
                  .reduce<string[]>((acc, round) => {
                      acc.push(String(round.numberOfRounds))
                      return acc
                  }, [])
                  .join('-')
            : null

        const title = this.headerToString(obj, sequence)

        const rounds = sequence
            ? this.roundTransformer.toString(omit(obj.rounds[0], ['numberOfRounds']) as IRound)
            : obj.rounds.map((o) => this.roundTransformer.toString(o)).join(this.breakline)

        return this.displayArray([title, rounds], '\n')
    }

    private headerToString(obj: IEventBlock, sequence?: string | null): string | null {
        if (obj.event_type === 'max_weight') return null

        const timerHeader = this.timerToString(obj.event_type, obj as unknown as TMergedTimer, sequence)

        return this.displayArray([timerHeader, obj.info], ' : ', 'bloco: ')
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
