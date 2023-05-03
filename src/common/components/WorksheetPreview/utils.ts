import { IEventBlock, IEventMovement, TMovementWeight } from '@models/block'
import { numberHelper } from '@utils/numbers'
import { pluralize } from '@utils/strings'
import { getTimeFromSeconds } from '@utils/time'

export function displayWeight(weight?: TMovementWeight): string {
    if (!weight?.value || weight.type === 'none') return ''

    const value = numberHelper.convertNumbers(weight.value, { suffix: '', separator: `${weight.type} ` })

    return ` - ${value.trim()}${weight.type}`
}

export function displayMovement(movement: IEventMovement) {
    const weight = displayWeight(movement.weight)
    const reps = numberHelper.convertNumbers(movement.reps, { suffix: '' })
    const repsDisplay = reps && reps !== '0' ? `${reps} ` : ''
    return `${repsDisplay}${movement.name}${weight}`
}

export const getTimeCap = (block: IEventBlock) => {
    if (block.event_type === 'emom') {
        if (!block.each || !block.numberOfRounds) return ''
        const each = getTimeFromSeconds(block.each)
        return ` - Cada ${each} por ${block.numberOfRounds} ${pluralize(block.numberOfRounds, 'round')}`
    }

    if (block.event_type === 'tabata') {
        if (!block.work || !block.rest || !block.numberOfRounds) return ''
        const work = getTimeFromSeconds(block.work)
        const rest = getTimeFromSeconds(block.rest)
        return ` - ${work}/${rest} por ${block.numberOfRounds} ${pluralize(block.numberOfRounds, 'round')}`
    }

    if (block.event_type === 'not_timed') return ''

    if (!block.timecap) return ''

    const timecap = getTimeFromSeconds(block.timecap)
    return ` - ${timecap}`
}
