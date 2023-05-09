import { IRound, IRoundEMOM, IRoundTabata, IRoundTimecap } from '@models/block'
import { TTimerTypes } from '@models/time'
import { roundTypes } from '@utils/worksheetInitials'

import { BaseTransformer } from './base'
import { MovementTransformer, movementTransformer } from './movement'

type TRoundTypeTransform = 'emom' | 'for time' | 'amrap' | 'tabata'

export class RoundTransformer extends BaseTransformer {
    private breakline = '\n'
    private complexSplit = ' + '

    private movementRegex = this.mergeRegex(['^(?:(?:', this.numberRegex, ')?)+(?<name>', this.movementNameRegex, ')+'])

    private complexRegex = this.mergeRegex(['^(?<movements>', this.movementRegex, ')(?<weight>', this.weightRegex, ')'])
    private titleRegex = this.mergeRegex(
        ['^round:', '(?:\\s(?<rounds>\\d+))?', '(?:\\s(?<type>', this.timerTypeRegex, ')(?:\\s(?<time>.*))?)?\n'],
        'im'
    )

    constructor(private movementTransformer: MovementTransformer) {
        super()
    }

    toObject(text: string): IRound | null {
        const match = text.match(this.titleRegex)

        if (match?.groups) {
            const extractedText = text.replace(match[0], '').trim()

            const restRoundTime = this.findRest(text)
            if (restRoundTime) return { type: 'rest', time: restRoundTime, movements: [] }

            const extractedMovements = this.textMovementsToRound(extractedText)
            if (!extractedMovements) return null

            const type =
                extractedMovements.type === 'complex'
                    ? 'complex'
                    : this.tranformType(match.groups.type as TRoundTypeTransform)

            const numberOfRounds = Number(match.groups.rounds || 1)

            switch (type) {
                case 'tabata': {
                    const [work, rest] = this.extractTimeByType(type, match.groups.time)

                    return {
                        type,
                        numberOfRounds,
                        work,
                        rest,
                        movements: extractedMovements.movements,
                    }
                }
                case 'emom': {
                    const time = this.extractTimeByType(type, match.groups.time)

                    return {
                        type,
                        numberOfRounds,
                        each: time,
                        movements: extractedMovements.movements,
                    }
                }
                case 'not_timed':
                case 'complex': {
                    return {
                        type,
                        numberOfRounds,
                        movements: extractedMovements.movements,
                    }
                }
                default: {
                    const time = this.extractTimeByType(type, match.groups.time)

                    return {
                        type,
                        numberOfRounds,
                        timecap: time,
                        movements: extractedMovements.movements,
                    }
                }
            }
        }

        const restRoundTime = this.findRest(text)
        if (restRoundTime) return { type: 'rest', time: restRoundTime, movements: [] }

        return this.textMovementsToRound(text)
    }

    toString(obj: IRound): string {
        if (obj.type === 'rest') return this.displayRest(obj.time)

        const title = this.titleToString(obj)

        if (obj.type === 'complex') {
            if (title) return `${title}\n${this.displayComplex(obj)}`
            return this.complexToString(obj)
        }

        let text = title || ''
        if (text) text += '\n'

        text += obj.movements.map((o) => this.movementTransformer.toString(o)).join(this.breakline)

        if (!text) return ''

        return text
    }

    private titleToString(obj: IRound): string | null {
        const rounds = obj.numberOfRounds && obj.numberOfRounds > 1 ? ` ${obj.numberOfRounds}` : null

        if (obj.type === 'rest') return null

        if (obj.type === 'complex') {
            const displayRounds = super.displayNumberOfRounds(obj.numberOfRounds, '')
            if (!displayRounds) return null
            return `round: ${displayRounds}`
        }

        const type = this.typeToString(obj.type)
        const timeString = this.roundTimerToString(obj)

        if (!rounds && !type) return null

        return `round:${rounds || ''}${type ? ` ${type}` : ''}${timeString ? ` ${timeString}` : ''}`
    }

    private textMovementsToRound(text: string): IRound | null {
        const textMovements = text.split(this.breakline)
        if (!textMovements.length) return null

        if (textMovements.length === 1) {
            const textToMatch = textMovements[0]
            const match = textToMatch.match(this.complexRegex)

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

    private tranformType(type?: TRoundTypeTransform): TTimerTypes {
        if (!type) return 'not_timed'
        if (type === 'for time') return 'for_time'

        return type
    }

    private typeToString(type: TTimerTypes): TRoundTypeTransform | null {
        if (!type || type === 'not_timed') return null
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

    private complexToString(obj: IRound): string {
        if (obj.type !== 'complex') return ''

        const complex = obj.movements.map((m) => this.movementTransformer.displayMovement(m)).join(this.complexSplit)
        const weight = this.movementTransformer.weightToString(obj.movements[0].weight)

        return `${complex}${weight}`
    }

    displayTitle(round: IRound): string {
        if (round.type === 'rest') return ''
        if (round.type === 'complex') return super.displayNumberOfRounds(round.numberOfRounds)
        const time =
            round.type === 'amrap' || round.type === 'for_time' || round.type === 'emom' || round.type === 'tabata'
                ? this.displayRoundTimer(round)
                : ''

        const numberOfRounds = !time ? super.displayNumberOfRounds(round.numberOfRounds) : ''

        const type = round.type && round.type != 'not_timed' ? roundTypes[round.type] : ''
        if (!numberOfRounds && !type) return ''
        return `${numberOfRounds} ${type}${time}`.trim()
    }

    private roundTimerToString(obj: IRound): string | null {
        switch (obj.type) {
            case 'tabata':
                return super.timerToString('tabata', obj.work, obj.rest)

            case 'emom':
                return super.timerToString('emom', obj.each)

            case 'for_time':
            case 'amrap':
                return super.timerToString('emom', obj.timecap)

            default:
                return super.timerToString('not_timed')
        }
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
