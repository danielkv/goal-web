import dayjs from 'dayjs'

import { IEMOMTimer, ITabataTimer, ITimecapTimer, TTimerTypes, TTimersForm } from '@models/time'
import { pluralize } from '@utils/strings'
import { getTimeFromSeconds } from '@utils/time'

import { RegexHelper } from './RegexHelper'
import { numberHelper } from './numbers'

export abstract class BaseTransformer extends RegexHelper {
    protected timeRegex = /^((?<t1>\d+)\s?(?<t1_type>m(?:in)?|s(?:ec)?)?(?:(?<t2>\d+)\s?s(?:ec)?)?)$/i

    protected numberRegex = /(?:(\d|\?)+(?:[\d\-\*\,\/\sa\?]*(?:\d|\?))?|max)/
    protected weightTypeRegex = /kg|%|lb/is

    protected repsTypeRegex = /x|m|km|s|mi|min|sec|cal/i
    protected timerTypeRegex = /emom|for time|amrap|tabata/i
    protected restRegex = this.mergeRegex([
        '^((?:(?:rest\\s)(?<time1>',
        this.timeRegex,
        '))|(?:(?<time2>',
        this.timeRegex,
        ')(?:\\s(?:rest))))',
    ])
    protected tabataTimeRegex = this.mergeRegex(['(?<work>', this.timeRegex, ')/(?<rest>', this.timeRegex, ')'])

    protected weightRegex = this.mergeRegex([
        '(?:((?<weight>',
        this.numberRegex,
        ')?)',
        '(?<weight_type>',
        this.weightTypeRegex,
        ')+)?',
    ])

    protected repsRegex = this.mergeRegex([
        '((?<reps_number>',
        /(?:\d+\º\s)?/,
        this.numberRegex,
        ')((?<reps_type>',
        this.repsTypeRegex,
        ')?)+)',
    ])

    protected movementBaseRegex = this.mergeRegex(['^(?<reps>', this.repsRegex, '\\s+)?(?<name>.+)$'])

    protected weightBaseRegex = this.mergeRegex(['^(?<movement>.+)\\s+(?<weight>', this.weightRegex, ')$'])

    // emom 2 rounds 1min
    protected timerEmomRegex = this.mergeRegex(
        ['^emom(?:\\s(?<numberOfRounds>\\d+)(?:\\srounds|x)?)?', '(?:\\s', '(?<time>', this.timeRegex, ')', ')'],
        'i'
    )

    // tabata 2 rounds 20s/10s
    protected timerTabataRegex = this.mergeRegex(
        [
            '^tabata(?:\\s(?<numberOfRounds>\\d+)(?:\\srounds|x)?)?',
            '(?:\\s',
            '(?<time>',
            this.tabataTimeRegex,
            ')',
            ')?',
        ],
        'i'
    )

    // 2 rounds amrap 3min
    protected timerAmrapRegex = this.mergeRegex(
        ['^(?:(?<numberOfRounds>\\d+)(?:\\srounds|x)?)\\samrap', '(?:\\s', '(?<time>', this.timeRegex, ')', ')?'],
        'i'
    )

    // 2 rounds for time 3min
    protected timerFortimeRegex = this.mergeRegex(
        [
            '^(?:(?<numberOfRounds>',
            this.numberRegex,
            '+)(?:\\srounds|x)?)\\sfor(?:\\s|-)?time',
            '(?:\\s',
            '(?<time>',
            this.timeRegex,
            ')',
            ')?',
        ],
        'i'
    )

    protected headerRegex = this.mergeRegex([
        '^(?:(?<number>',
        this.numberRegex,
        ')|',
        '(?<emom>',
        this.timerEmomRegex,
        ')|',
        '(?<tabata>',
        this.timerTabataRegex,
        ')|',
        '(?<amrap>',
        this.timerAmrapRegex,
        ')|',
        '(?<fortime>',
        this.timerFortimeRegex,
        '))$',
    ])

    protected extractTimerFromString(
        text: string
    ): (Partial<TTimersForm> & { type: TTimerTypes; reps?: string }) | null {
        const match = text.match(this.headerRegex)

        if (!match?.groups) return null

        if (match.groups.emom) {
            const result = this.extractEmomTimerFromString(match.groups.emom)
            if (result) return result
        } else if (match.groups.tabata) {
            const result = this.extractTabataTimerFromString(match.groups.tabata)
            if (result) return result
        } else if (match.groups.amrap) {
            const result = this.extractAmrapTimerFromString(match.groups.amrap)
            if (result) return result
        } else if (match.groups.fortime) {
            const result = this.extractFortimeTimerFromString(match.groups.fortime)
            if (result) return result
        } else if (match.groups.number) {
            const result = this.extractNumberHeaderFromString(match.groups.number)
            if (result) return result
        }

        return {
            type: 'not_timed',
            numberOfRounds: 1,
        }
    }

    private extractRounds(roundsText?: string, defaultValue = 1) {
        if (!roundsText) return { numberOfRounds: defaultValue }
        if (!Number.isNaN(Number(roundsText))) return { numberOfRounds: Number(roundsText) }

        const match = roundsText.match(numberHelper.sequenceRegex)
        if (!match) return { numberOfRounds: defaultValue }

        const reps = roundsText.trim()

        return { numberOfRounds: reps.split('-').length, reps }
    }

    protected extractNumberHeaderFromString(text: string): { type: 'not_timed'; reps?: string } | null {
        const numberOfRoundsObj = this.extractRounds(text)

        return {
            type: 'not_timed',
            ...numberOfRoundsObj,
        }
    }
    protected extractFortimeTimerFromString(
        text: string
    ): (ITimecapTimer & { type: 'for_time'; reps?: string }) | null {
        const matchSpecific = text.match(this.timerFortimeRegex)
        if (!matchSpecific?.groups) return null
        const numberOfRoundsObj = this.extractRounds(matchSpecific?.groups?.numberOfRounds)

        if (matchSpecific?.groups?.time) {
            const timecap = this.extractTimeByType('for_time', matchSpecific.groups.time.trim())

            return {
                type: 'for_time',
                timecap,
                ...numberOfRoundsObj,
            }
        } else {
            return {
                type: 'for_time',
                timecap: 0,
                ...numberOfRoundsObj,
            }
        }
    }

    protected extractAmrapTimerFromString(text: string): (ITimecapTimer & { type: 'amrap'; reps?: string }) | null {
        const matchSpecific = text.match(this.timerAmrapRegex)
        if (!matchSpecific?.groups) return null
        const numberOfRoundsObj = this.extractRounds(matchSpecific?.groups?.numberOfRounds)

        if (matchSpecific?.groups?.time) {
            const timecap = this.extractTimeByType('amrap', matchSpecific.groups.time.trim())

            return {
                type: 'amrap',
                timecap,
                ...numberOfRoundsObj,
            }
        }

        return null
    }

    protected extractTabataTimerFromString(text: string): (ITabataTimer & { type: 'tabata'; reps?: string }) | null {
        const matchSpecific = text.match(this.timerTabataRegex)
        if (!matchSpecific?.groups) return null

        const numberOfRoundsObj = this.extractRounds(matchSpecific?.groups?.numberOfRounds, 8)

        if (matchSpecific?.groups?.time) {
            const [work, rest] = this.extractTimeByType('tabata', matchSpecific.groups.time.trim())

            return {
                type: 'tabata',
                work,
                rest,
                ...numberOfRoundsObj,
            }
        } else {
            return {
                type: 'tabata',
                work: 20,
                rest: 10,
                ...numberOfRoundsObj,
            }
        }
    }

    protected extractEmomTimerFromString(text: string): (IEMOMTimer & { type: 'emom'; reps?: string }) | null {
        const matchSpecific = text.match(this.timerEmomRegex)
        if (!matchSpecific?.groups) return null

        if (matchSpecific?.groups?.time) {
            const time = this.extractTimeByType('emom', matchSpecific.groups.time.trim())

            if (matchSpecific.groups.numberOfRounds) {
                const numberOfRoundsObj = this.extractRounds(matchSpecific.groups.numberOfRounds)

                return {
                    type: 'emom',
                    each: time,
                    ...numberOfRoundsObj,
                }
            } else {
                if (time % 60 === 0)
                    return {
                        type: 'emom',
                        numberOfRounds: time / 60,
                        each: 60,
                    }
            }
        }

        return null
    }

    protected extractTimeByType(type: Extract<TTimerTypes, 'tabata'>, time: string): [number, number]
    protected extractTimeByType(type: Exclude<TTimerTypes, 'tabata'>, time: string): number
    protected extractTimeByType(type: TTimerTypes, time: string): number | [number, number] {
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

        const minutes =
            match.groups.t1_type && ['m', 'min'].includes(match.groups.t1_type) ? Number(match.groups.t1) : undefined
        const seconds =
            ['s', 'sec'].includes(match.groups.t1_type) || !match.groups.t1_type
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
    protected timerToString(type: TTimerTypes, t1?: number | never, t2?: never | number): string | null {
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
