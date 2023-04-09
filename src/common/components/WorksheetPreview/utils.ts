import { isNumber } from 'radash'

import { EventBlock, MovementWeight } from '@models/block'
import { getTimeFromSeconds } from '@utils/time'

export function displayWeight(weight?: MovementWeight): string {
    if (!weight?.value || weight.type === 'none') return ''

    const value = getRoundsDisplay(weight.value, '', `${weight.type} `)

    return ` - ${value}${weight.type}`
}

export const getTimeCap = (block: EventBlock) => {
    if (block.event_type === 'emom') {
        const each = getTimeFromSeconds(block.each)
        const forTime = getTimeFromSeconds(block.for)
        return ` - Cada ${each} por ${forTime}`
    }

    if (block.event_type === 'not_timed') return ''

    const timecap = getTimeFromSeconds(block.timecap)
    return ` - ${timecap}`
}

export function getRoundsDisplay(_rounds?: string, suffix = 'Rounds', separator = '-'): string {
    if (!_rounds) return ''

    if (isNumber(Number(_rounds))) return `${_rounds} ${suffix}`

    const rounds = _rounds.replace(/([[:alpha:]]+)/g, '')
    const sexMatch = rounds.match(/^([\d]+)\/([\d]+)$/)
    const sequenceMatch = rounds.match(/([\d]+)[\-]+/g)
    const calcMatch = rounds.match(/^([\d]+)(\-|\+)([\d]+)\*([\d]+)$/)

    if (sexMatch) {
        const masc = Number(sexMatch[1])
        const fem = Number(sexMatch[2])

        return `${masc}/${fem}`
    }

    if (calcMatch) {
        const n1 = Number(calcMatch[1])
        const n2 = calcMatch[2]
        const n3 = Number(calcMatch[3])
        const n4 = Number(calcMatch[4])

        let numbers: number[]

        if (n2 === '-') {
            numbers = Array.from({ length: n4 }).map((_, index) => n1 - index * n3)
        } else {
            numbers = Array.from({ length: n4 }).map((_, index) => n1 + index * n3)
        }

        return numbers.join(separator)
    }

    if (sequenceMatch) return rounds.replace(/([^\d]+)/g, separator)

    return _rounds
}
