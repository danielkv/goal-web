import { EventBlock, MovementWeight } from '@models/block'
import { getTimeFromSeconds } from '@utils/time'
import { getRoundsDisplay } from '@view/CreateNewDay/utils'

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
