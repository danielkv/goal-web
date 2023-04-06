import { EventBlock, MovementWeight } from '@models/block'
import { getTimeFromSeconds } from '@utils/time'

export function displayWeight(weight?: MovementWeight): string {
    if (!weight?.value || weight.type === 'none') return ''

    const value = getRoundsDisplay(weight.value, `${weight.type} `)

    return ` - ${value}${weight.type}`
}

export const getTimeCap = (block: EventBlock) => {
    if (block.event_type === 'emom') {
        const each = getTimeFromSeconds(block.each)
        const forTime = getTimeFromSeconds(block.for)
        return ` - Cada ${each} por ${forTime}`
    }

    const timecap = getTimeFromSeconds(block.timecap)
    return ` - ${timecap}`
}

export function getRoundsDisplay(_rounds?: string, separator = '-'): string {
    if (!_rounds) return ''

    const rounds = _rounds.replace(/([[:alpha:]]+)/g, '')
    const simpleCalcMatch = rounds.match(/^([\d]+)(\/|\*)([\d]+)$/)
    const linearMatch = rounds.match(/([\d]+)/g)
    const calcMatch = rounds.match(/^([\d]+)(\-|\+)([\d]+)\*([\d]+)$/)

    if (simpleCalcMatch) {
        const n1 = Number(simpleCalcMatch[1])
        const n2 = simpleCalcMatch[2]
        const n3 = Number(simpleCalcMatch[3])
        let numbers: number[]

        if (n2 === '/') {
            const res = n1 / n3
            numbers = Array.from({ length: n3 }).map((_, index) => n1 - index * res)
        } else {
            numbers = Array.from({ length: n3 }).map((_, index) => n1 + index * n1)
        }

        return numbers.join(separator)
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

    if (linearMatch) return rounds.replace(/([^\d]+)/g, separator)

    return rounds
}
