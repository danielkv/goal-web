import dayjs from 'dayjs'

import { TTimerType } from '@models/time'
import { getTimeFromSeconds } from '@utils/time'

export abstract class BaseTransformer {
    protected timeRegex = /^((?<t1>\d+)\s?(?<t1_type>m|s)(?:(?<t2>\d+)\s?s)?)/i
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
}
