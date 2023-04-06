import dayjs from 'dayjs'

import { Path } from '@interfaces/app'
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
import { getCurrentPeace, getIndexes, getLastIndex, getPeaceFromPath } from '@utils/paths'
import { breadCrumbLabelMaps, eventTypesMap } from '@utils/worksheetInitials'

export function getCurrentForm(path: Path): [string, number, Record<string, number>] {
    let currentForm = getCurrentPeace(path)
    let lastIndex = getLastIndex(path)
    const indexMap = getIndexes(path)

    const result: [string, number, Record<string, number>] = [currentForm, lastIndex, indexMap]

    return result
}

export function getBreadcrumbLabel(worksheet: Worksheet, path: Path): string {
    if (path === 'worksheet') return 'Planilha'

    const obj = getPeaceFromPath<Record<string, any>>(worksheet, path)
    const [form, formIndex] = getCurrentForm(path)

    if (isDay(obj)) {
        const day = dayjs(obj.date, 'YYYY-MM-DD')
        return day.isValid() ? day.format('DD/MM/YYYY') : 'Sem data'
    }
    if (isPeriod(obj)) return `${String(formIndex + 1)}º Período `
    if (isGroup(obj)) return obj.name || 'Grupo'
    if (isBlock(obj)) {
        if (isEventBlock(obj)) return eventTypesMap[obj.event_type] || 'Evento'
        if (isTextBlock(obj)) return 'Texto'
        if (isRestBlock(obj)) return 'Rest'
    }
    if (isRound(obj)) return `Round ${String(formIndex + 1)}`

    return breadCrumbLabelMaps[form] || form
}
