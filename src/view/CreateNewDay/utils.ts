import { isNumber } from 'radash'

export function extractPaths(path: string) {
    const regex = /([\w\-]+)/gm
    const paths = [...path.matchAll(regex)].map((item) =>
        !Number.isNaN(Number(item[0])) ? Number(item[0]) : item[0]
    )

    return paths
}

export function getCurrentForm(path: string): [string, number] | [string] {
    const extractedPaths = extractPaths(path)
    let currentForm = ''
    const lastItem = extractedPaths.at(-1)
    let index = isNumber(lastItem) ? lastItem : null

    let i = extractedPaths.length
    do {
        const last = extractedPaths.at(i)
        if (last && !isNumber(last)) currentForm = last
        i--
    } while (!currentForm && i >= 0)

    return index !== null ? [currentForm, index] : [currentForm]
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
