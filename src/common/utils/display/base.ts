import { TTimerTypes } from '@models/time'
import { pluralize } from '@utils/strings'
import { getTimeFromSeconds } from '@utils/time'

export class BaseDisplay {
    protected displayRest(time: number): string {
        return `${getTimeFromSeconds(time)} Rest`
    }

    protected displayTimer(type: 'emom', rounds: number, each: number): string
    protected displayTimer(type: 'tabata', rounds: number, work: number, rest: number): string
    protected displayTimer(type: 'for_time' | 'amrap', rounds: number, timecap: number): string
    protected displayTimer(type: 'not_timed'): null
    protected displayTimer(
        type: TTimerTypes,
        rounds?: number | never,
        t1?: number | never,
        t2?: never | number
    ): string | null {
        if (!rounds) return null

        if (type === 'emom') {
            if (!t1) return null
            const each = getTimeFromSeconds(t1)
            return `Cada ${each} por ${rounds} ${pluralize(rounds, 'round')}`
        }

        if (type === 'tabata') {
            if (!t1 || !t2) return null
            const work = getTimeFromSeconds(t1)
            const rest = getTimeFromSeconds(t2)
            return `${work}/${rest} por ${rounds} ${pluralize(rounds, 'round')}`
        }

        if (t1 === undefined) return null

        const timecap = t1 === 0 ? '' : getTimeFromSeconds(t1)
        const roundsDisplay = rounds > 1 ? this.displayNumberOfRounds(rounds) : ''

        return this.displayArray([timecap.trim(), roundsDisplay.trim()], ' - ')
    }

    protected displayNumberOfRounds(rounds?: number, suffix = 'rounds', prefix?: string): string {
        if (!rounds) return ''
        if (rounds <= 1) return ''
        return this.displayArray([prefix, rounds, suffix])
    }

    displayArray(array: any[], separator = ' ', prefix = '', suffix = ''): string {
        const text = array.filter((part) => part).join(separator)

        if (!text) return ''

        return `${prefix}${text}${suffix}`
    }
}
