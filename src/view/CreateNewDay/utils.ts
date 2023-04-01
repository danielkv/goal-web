import dayjs from 'dayjs'
import { get, isNumber } from 'radash'

import { Worksheet } from '@models/day'
import {
    isBlock,
    isDay,
    isEventBlock,
    isGroup,
    isPeriod,
    isRestBlock,
    isRound,
    isTextBlock,
} from '@utils/models'

import { eventTypesMap } from './components/WorksheetPreview/config'
import { breadCrumbLabelMaps, worksheetStore } from './config'

export function getCurrentObject<T>(path: string, until?: string): T {
    let normalizedPath = path.replace(/worksheet.?/, '')

    if (until) {
        normalizedPath = normalizedPath.slice(0, normalizedPath.search(until) + until.length - 1)
    }
    const object = get<Worksheet, T>(worksheetStore, normalizedPath)

    return object as T
}

export function extractPaths(path: string) {
    const regex = /([\w\-]+)/gm
    const paths = [...path.matchAll(regex)].map((item) =>
        !Number.isNaN(Number(item[0])) ? Number(item[0]) : item[0]
    )

    return paths
}

export function getCurrentForm(path: string): [string, number, Record<string, number>] {
    const extractedPaths = extractPaths(path)
    let currentForm = ''
    const indexMap: Record<string, number> = {}
    const lastItem = extractedPaths.at(-1)
    let index = isNumber(lastItem) ? lastItem : -1

    extractedPaths.forEach((element, idx) => {
        if (!isNumber(element)) {
            currentForm = element

            if (['days', 'periods', 'groups', 'blocks', 'rounds'].includes(element)) {
                const arrayIndex = extractedPaths[idx + 1]

                if (arrayIndex !== undefined && isNumber(arrayIndex)) indexMap[element] = arrayIndex
            }
        }
    })

    return [currentForm, index, indexMap]
}

export function buildTree(path: string) {
    const paths = extractPaths(path)

    return paths.reduce<string[]>((acc, item, index) => {
        const curr = paths.slice(0, index + 1).join('.')

        if (isNumber(item)) {
            const nextIndex = acc.length - 1

            acc[nextIndex] = `${acc[nextIndex]}.${item}`
        } else acc.push(curr)

        return acc
    }, [])
}

export function getBreadcrumbLabel(path: string): string {
    const obj = getCurrentObject<Record<string, any>>(path)
    const [form, formIndex] = getCurrentForm(path)

    if (isDay(obj)) return dayjs(obj.date, 'YYYY-MM-DD').format('DD/MM/YYYY')
    if (isPeriod(obj)) return `${String(formIndex + 1)}º Período `
    if (isGroup(obj)) return obj.name
    if (isBlock(obj)) {
        if (isEventBlock(obj)) return eventTypesMap[obj.event_type] || 'Evento'
        if (isTextBlock(obj)) return 'Texto'
        if (isRestBlock(obj)) return 'Rest'
    }
    if (isRound(obj)) return `Round ${String(formIndex + 1)}`

    return breadCrumbLabelMaps[form] || form
}
