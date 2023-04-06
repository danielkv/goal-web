import { produce } from 'solid-js/store'

import { setCurrentPath, setWorksheetStore } from '@contexts/worksheet/store'
import { Path } from '@interfaces/app'
import { Block, EventBlock, EventRound, RestBlock, TextBlock } from '@models/block'
import { Day, Group, Period } from '@models/day'

import { getLastIndex, getPeaceFromPath, pathToParent } from './paths'

export function isDay(obj: Record<string, any>): obj is Day {
    if (obj?.hasOwnProperty('name') && obj.hasOwnProperty('date') && obj.hasOwnProperty('periods'))
        return true
    return false
}

export function isPeriod(obj: Record<string, any>): obj is Period {
    if (obj?.hasOwnProperty('groups')) return true
    return false
}

export function isGroup(obj: Record<string, any>): obj is Group {
    if (obj?.hasOwnProperty('name') && obj.hasOwnProperty('blocks')) return true
    return false
}

export function isBlock(obj: Record<string, any>): obj is Block {
    if (obj?.hasOwnProperty('type') && ['event', 'rest', 'text', ''].includes(obj.type)) return true
    return false
}

export function isRound(obj: Record<string, any>): obj is EventRound {
    if (obj?.hasOwnProperty('movements')) return true
    return false
}
export function isEventBlock(obj: Record<string, any>): obj is EventBlock {
    if (obj?.hasOwnProperty('type') && obj.type === 'event') return true
    return false
}
export function isTextBlock(obj: Record<string, any>): obj is TextBlock {
    if (obj?.hasOwnProperty('type') && obj.type === 'text') return true
    return false
}
export function isRestBlock(obj: Record<string, any>): obj is RestBlock {
    if (obj?.hasOwnProperty('type') && obj.type === 'rest') return true
    return false
}

export const handleRemovePeace = <Values = Record<string, any>>(path: Path) => {
    const listPath = pathToParent(path)
    const lastIndex = getLastIndex(path)
    const returnPath = pathToParent(path, 2)

    setWorksheetStore(
        produce((current) => {
            const list = getPeaceFromPath<Values[]>(current, listPath)

            list.splice(lastIndex, 1)
        })
    )

    setTimeout(() => {
        setCurrentPath(returnPath)
    }, 1)
}

export const handleAddPeace = <Values>(
    path: Path,
    initialValues: Values,
    override?: Partial<Values>
) => {
    const listPath = pathToParent(path)
    const lastIndex = getLastIndex(path)

    setWorksheetStore(
        produce((current) => {
            const list = getPeaceFromPath<Values[]>(current, listPath)

            list.splice(lastIndex, 0, { ...initialValues, ...override })

            //return current
        })
    )
    setTimeout(() => {
        setCurrentPath(path)
    }, 1)
}
