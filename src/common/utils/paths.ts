import { get, isNumber } from 'radash'

import { NestedKeyOf, Path } from '@interfaces/app'
import { Worksheet } from '@models/day'

export function getPeaceFromPath<T>(object: Worksheet, path: Path, until?: string): T {
    let normalizedPath = path.replace(/worksheet.?/, '')

    if (until) {
        normalizedPath = splicePath(path, until)
    }
    const result = get<Worksheet, T>(object, normalizedPath)

    return result as T
}

export function splicePath(path: Path, until: string): Path {
    return path.slice(0, path.search(until) + until.length - 1) as Path
}

export function addToPath<T extends object | string>(
    initialPath: Path,
    path: T extends object ? NestedKeyOf<T> : T
): Path {
    return `${initialPath}.${path}` as Path
}

export function pathToParent(path: Path, count = 1): Path {
    const arrayPath = path.split('.')

    return arrayPath.slice(0, arrayPath.length - count).join('.') as Path
}

export function pathToNextIndex(path: Path, count = 1): Path {
    const newIndex = getLastIndex(path) + count

    const listPath = pathToParent(path)

    const finalPath = addToPath(listPath, `${newIndex}`)

    return finalPath
}

export function getLastIndex(path: Path): number {
    const arrayPath = path.split('.')
    return Number(
        arrayPath.reverse().find((ele) => {
            if (isNumber(Number(ele))) return true
        })
    )
}

export function extractPaths(path: string) {
    const regex = /([\w\-]+)/gm
    const paths = [...path.matchAll(regex)].map((item) =>
        !Number.isNaN(Number(item[0])) ? Number(item[0]) : item[0]
    )

    return paths
}

export function getIndexes(path: Path): Record<string, number> {
    const extractedPaths = extractPaths(path)

    return extractedPaths.reduce<Record<string, number>>((acc, element, idx) => {
        if (isNumber(element)) return acc
        if (!['days', 'periods', 'groups', 'blocks', 'rounds'].includes(element)) return acc

        const arrayIndex = extractedPaths[idx + 1]
        if (arrayIndex !== undefined && isNumber(arrayIndex)) acc[element] = arrayIndex

        return acc
    }, {})
}
