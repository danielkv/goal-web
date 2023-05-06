import dayjs from 'dayjs'

import { TTimerType } from '@models/time'

export abstract class BaseTransformer {
    protected timeRegex = /^((?<t1>\d+)(?<t1_type>m|s)(?:(?<t2>\d+)s)?)/i
    protected tabataRegex = /^((?<t1>\d+)(?<t1_type>m|s)(?:(?<t2>\d+)s)?)\/((?<t3>\d+)(?<t3_type>m|s)(?:(?<t4>\d+)s)?)/i
    protected restRegex = /^(?<time>(?<t1>\d+)(?<type>m|s)(?:(?<t2>\d+)s)?)\s(?:rest)/i

    protected extractTime(type: Extract<TTimerType, 'tabata'>, time: string): [number, number]
    protected extractTime(type: Exclude<TTimerType, 'tabata'>, time: string): number
    protected extractTime(type: TTimerType, time: string): number | [number, number] {
        if (!time) return 0

        if (type === 'tabata') {
            const match = time.match(this.tabataRegex)

            if (!match?.groups) return 0

            const minutesWork = match.groups.t1_type === 'm' ? Number(match.groups.t1) : undefined
            const secondsWork =
                match.groups.t1_type === 's' ? Number(match.groups.t1) : Number(match.groups.t2) || undefined

            const minutesRest = match.groups.t1_type === 'm' ? Number(match.groups.t1) : undefined
            const secondsRest =
                match.groups.t1_type === 's' ? Number(match.groups.t1) : Number(match.groups.t2) || undefined

            return [
                dayjs.duration({ minutes: minutesWork, seconds: secondsWork }).asSeconds(),
                dayjs.duration({ minutes: minutesRest, seconds: secondsRest }).asSeconds(),
            ]
        }

        const match = time.match(this.timeRegex)

        if (!match?.groups) return 0

        const minutes = match.groups.t1_type === 'm' ? Number(match.groups.t1) : undefined
        const seconds = match.groups.t1_type === 's' ? Number(match.groups.t1) : Number(match.groups.t2) || undefined

        return dayjs.duration({ minutes, seconds }).asSeconds()
    }

    protected findRest(text: string): number | null {
        const match = text.match(this.restRegex)
        if (!match?.groups?.time) return null

        return this.extractTime('for_time', match?.groups?.time)
    }
}
