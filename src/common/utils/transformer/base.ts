import dayjs from 'dayjs'

import { TTimerType } from '@models/time'
import { pluralize } from '@utils/strings'
import { getTimeFromSeconds } from '@utils/time'

export abstract class BaseTransformer {
    protected timeRegex = /^((?<t1>\d+)\s?(?<t1_type>m(?:in)?|s(?:ec)?)(?:(?<t2>\d+)\s?s(?:ec)?)?)$/i
    protected tabataTimeRegex =
        /^(?<work>(?<t1>\d+)(?<t1_type>m(?:in)?|s(?:ec)?)(?:(?<t2>\d+)s(?:ec)?)?)\/(?<rest>(?<t3>\d+)(?<t3_type>m(?:in)?|s(?:ec)?)(?:(?<t4>\d+)s(?:ec)?)?)/i
    protected restRegex =
        /^(?:(?:rest\s)(?<time1>(\d+)\s?(m(?:in)?|s(?:ec)?)(?:(\d+)\s?s(?:ec)?)?))|(?:(?<time2>(\d+)\s?(m(?:in)?|s(?:ec)?)(?:(\d+)\s?s(?:ec)?)?)(?:\s(?:rest)))$/i

    protected extractTimeByType(type: Extract<TTimerType, 'tabata'>, time: string): [number, number]
    protected extractTimeByType(type: Exclude<TTimerType, 'tabata'>, time: string): number
    protected extractTimeByType(type: TTimerType, time: string): number | [number, number] {
        if (!time) return 0

        if (type === 'tabata') {
            const match = time.match(this.tabataTimeRegex)
            if (!match?.groups) return 0

            const work = this.extractTime(match.groups.work)
            const rest = this.extractTime(match.groups.rest)

            return [work, rest]
        }

        return this.extractTime(time)
    }

    protected extractTime(time: string): number {
        const match = time.match(this.timeRegex)
        if (!match?.groups) return 0

        const minutes = ['m', 'min'].includes(match.groups.t1_type) ? Number(match.groups.t1) : undefined
        const seconds = ['s', 'sec'].includes(match.groups.t1_type)
            ? Number(match.groups.t1)
            : Number(match.groups.t2) || undefined

        return dayjs.duration({ minutes, seconds }).asSeconds()
    }

    protected findRest(text: string): number | null {
        const match = text.match(this.restRegex)
        if (!match?.groups?.time1 && !match?.groups?.time2) return null

        return this.extractTime(match?.groups.time1 || match?.groups.time2)
    }

    protected displayRest(time: number): string {
        return `${getTimeFromSeconds(time)} Rest`
    }

    protected timerToString(type: 'emom', each: number): string
    protected timerToString(type: 'tabata', work: number, rest: number): string
    protected timerToString(type: 'for_time' | 'amrap', timecap: number): string
    protected timerToString(type: 'not_timed'): null
    protected timerToString(type: TTimerType, t1?: number | never, t2?: never | number): string | null {
        switch (type) {
            case 'tabata': {
                if (!t1 || !t2) return null
                const work = getTimeFromSeconds(t1)
                const rest = getTimeFromSeconds(t2)
                return `${work}/${rest}`
            }
            case 'emom':
            case 'for_time':
            case 'amrap': {
                if (!t1) return null
                const time = getTimeFromSeconds(t1)
                return time
            }
            default:
                return null
        }
    }

    protected displayTimer(type: 'emom', rounds: number, each: number): string
    protected displayTimer(type: 'tabata', rounds: number, work: number, rest: number): string
    protected displayTimer(type: 'for_time' | 'amrap', rounds: number, timecap: number): string
    protected displayTimer(type: 'not_timed'): null
    protected displayTimer(
        type: TTimerType,
        rounds?: number | never,
        t1?: number | never,
        t2?: never | number
    ): string | null {
        if (!rounds) return null

        if (type === 'emom') {
            if (!t1) return null
            const each = getTimeFromSeconds(t1)
            return ` - Cada ${each} por ${rounds} ${pluralize(rounds, 'round')}`
        }

        if (type === 'tabata') {
            if (!t1 || !t2) return null
            const work = getTimeFromSeconds(t1)
            const rest = getTimeFromSeconds(t2)
            return ` - ${work}/${rest} por ${rounds} ${pluralize(rounds, 'round')}`
        }

        if (!t1) return null

        const timecap = getTimeFromSeconds(t1)
        const roundsDisplay = rounds > 1 ? ` - ${this.displayNumberOfRounds(rounds)}` : ''

        return ` - TC: ${timecap}${roundsDisplay}`
    }

    protected displayNumberOfRounds(rounds?: number): string {
        return rounds && rounds > 1 ? `${rounds} rounds` : ''
    }
}
