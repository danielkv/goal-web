import { Block, EventBlock, EventRound, RestBlock, TextBlock } from '@models/block'
import { Day, Group, Period } from '@models/day'

export function isDay(obj: Record<string, any>): obj is Day {
    if (obj.hasOwnProperty('name') && obj.hasOwnProperty('date') && obj.hasOwnProperty('periods'))
        return true
    return false
}

export function isPeriod(obj: Record<string, any>): obj is Period {
    if (obj.hasOwnProperty('groups')) return true
    return false
}

export function isGroup(obj: Record<string, any>): obj is Group {
    if (obj.hasOwnProperty('name') && obj.hasOwnProperty('blocks')) return true
    return false
}

export function isBlock(obj: Record<string, any>): obj is Block {
    if (obj.hasOwnProperty('type') && ['event', 'rest', 'text', ''].includes(obj.type)) return true
    return false
}

export function isRound(obj: Record<string, any>): obj is EventRound {
    if (obj.hasOwnProperty('movements')) return true
    return false
}
export function isEventBlock(obj: Record<string, any>): obj is EventBlock {
    if (obj.hasOwnProperty('type') && obj.type === 'event') return true
    return false
}
export function isTextBlock(obj: Record<string, any>): obj is TextBlock {
    if (obj.hasOwnProperty('type') && obj.type === 'text') return true
    return false
}
export function isRestBlock(obj: Record<string, any>): obj is RestBlock {
    if (obj.hasOwnProperty('type') && obj.type === 'rest') return true
    return false
}
