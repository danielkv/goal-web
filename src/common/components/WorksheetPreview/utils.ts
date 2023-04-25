import { isNumber } from 'radash'

import { IEventBlock, TMovementWeight } from '@models/block'
import { pluralize } from '@utils/strings'
import { getTimeFromSeconds } from '@utils/time'

export function displayWeight(weight?: TMovementWeight): string {
    if (!weight?.value || weight.type === 'none') return ''

    const value = getRoundsDisplay(weight.value, '', `${weight.type} `)

    return ` - ${value}${weight.type}`
}

export const getTimeCap = (block: IEventBlock) => {
    if (block.event_type === 'emom') {
        const each = getTimeFromSeconds(block.each)
        return ` - Cada ${each} por ${block.numberOfRounds} ${pluralize(block.numberOfRounds, 'round')}`
    }

    if (block.event_type === 'tabata') {
        const work = getTimeFromSeconds(block.work)
        const rest = getTimeFromSeconds(block.rest)
        return ` - ${work}/${rest} por ${block.numberOfRounds} ${pluralize(block.numberOfRounds, 'round')}`
    }

    if (block.event_type === 'not_timed') return ''

    const timecap = getTimeFromSeconds(block.timecap)
    return ` - ${timecap}`
}

export function getRoundsDisplay(rounds?: string, suffix = 'Rounds', separator = '-'): string {
    if (!rounds) return ''

    if (isNumber(Number(rounds))) return `${rounds} ${suffix}`

    //const rounds = _rounds.replace(/([[:alpha:]]+)/g, '')
    const sexMatch = rounds.match(/^([\d\,]+)\/([\d\,]+)$/)
    const sequenceMatch = rounds.match(/^([\d\,]+)[\-]+$/g)
    const calcMatch = rounds.match(/^([\d\,]+)(\-|\+)([\d\,]+)\*([\d]+)$/)
    const rangeMatch = rounds.match(/^([\d\,]+)\>\>([\d\,]+)$/)

    if (rangeMatch) {
        const n1 = Number(rangeMatch[1].replace(',', '.'))
        const n2 = Number(rangeMatch[2].replace(',', '.'))

        return `${n1} a ${n2}`
    }

    if (sexMatch) {
        const masc = Number(sexMatch[1].replace(',', '.'))
        const fem = Number(sexMatch[2].replace(',', '.'))

        return `${masc}/${fem}`
    }

    if (calcMatch) {
        const n1 = Number(calcMatch[1].replace(',', '.'))
        const n2 = calcMatch[2]
        const n3 = Number(calcMatch[3].replace(',', '.'))
        const n4 = Number(calcMatch[4].replace(',', '.'))

        let numbers: number[]

        if (n2 === '-') {
            numbers = Array.from({ length: n4 }).map((_, index) => n1 - index * n3)
        } else {
            numbers = Array.from({ length: n4 }).map((_, index) => n1 + index * n3)
        }

        return numbers.join(separator)
    }

    if (sequenceMatch) return rounds.replace(/([^\d]+)/g, separator)

    return rounds
}
