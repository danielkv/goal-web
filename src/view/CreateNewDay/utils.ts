import { get, isNumber } from 'radash'

import { Day } from '@models/day'

import { dayStore } from './config'

export function getCurrentObject<T>(path: string): T {
    const normalizedPath = path.replace(/day.?/, '')
    const object = get<Day, T>(dayStore, normalizedPath)

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

            if (['groups', 'blocks', 'rounds'].includes(element)) {
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
