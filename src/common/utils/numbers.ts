type TOpts = {
    suffix: string
    separator: string
}

class NumberHelper {
    private getOpts(opts?: Partial<TOpts>): TOpts {
        return { suffix: 'Rounds', separator: '-', ...opts }
    }

    private clearNumber(number: string, ending?: string | null) {
        if (ending) return number.trim().replaceAll(ending, '')

        return number.trim()
    }

    public getEnding(number: string): string | null {
        const match = number.trim().match(/(?<ending>km|m|x|s|min|kg|%|lb)$/)

        return match?.groups?.ending || null
    }

    public convertCalcMatch(number: string, opts?: Partial<TOpts>): string | null {
        const calcMatch = number.match(/^([\d\,]+)(\-|\+)([\d\,]+)\*([\d]+)$/)
        if (!calcMatch) return null

        const calculatedOpts = this.getOpts(opts)

        const n1 = Number(calcMatch[1].replace(',', '.'))
        const n2 = calcMatch[2]
        const n3 = Number(calcMatch[3].replace(',', '.'))
        const n4 = Number(calcMatch[4].replace(',', '.'))

        let numbers: number[]

        if (n2 === '-') {
            numbers = Array.from({ length: n4 }).map((_, index) => n1 - index * n3)
        } else {
            numbers = Array.from({ length: n4 }).map((_, index) => n1 + index * n3)
        }

        return numbers.join(calculatedOpts.separator)
    }

    public convertRangeMatch(number: string, opts?: Partial<TOpts>): string | null {
        const rangeMatch = number.match(/^([\d\,]+) a ([\d\,]+)$/)
        if (!rangeMatch) return null

        const n1 = Number(rangeMatch[1].replace(',', '.'))
        const n2 = Number(rangeMatch[2].replace(',', '.'))

        return `${n1} a ${n2}`
    }

    public convertSequenceMatch(number: string, opts?: Partial<TOpts>): string | null {
        const sequenceMatch = number.match(/((?:\d+\,?\d+?)(?:\/\d+\,?\d+?)?)?/g)
        if (!sequenceMatch) return null

        const calculatedOpts = this.getOpts(opts)

        return number.replace(/([^\d^\,^\/]+)/g, calculatedOpts.separator)
    }

    public convertNumbers(number?: string, opts?: Partial<TOpts>): string {
        if (!number) return ''

        const calculatedOpts = this.getOpts(opts)

        const ending = this.getEnding(number)
        const _number = this.clearNumber(number, ending)
        if (!Number.isNaN(Number(_number))) return `${_number} ${calculatedOpts.suffix}`

        const calcMatch = this.convertCalcMatch(_number, opts)
        if (calcMatch) return this.addSuffix(calcMatch, ending || calculatedOpts.suffix)

        const rangeMatch = this.convertRangeMatch(_number, opts)
        if (rangeMatch) return this.addSuffix(rangeMatch, ending || calculatedOpts.suffix)

        const sequenceMatch = this.convertSequenceMatch(_number, opts)
        if (sequenceMatch) return this.addSuffix(sequenceMatch, ending || calculatedOpts.suffix)

        return _number
    }

    private addSuffix(numberResult: string, suffix?: string) {
        return `${numberResult}${suffix}`
    }
}

export const numberHelper = new NumberHelper()