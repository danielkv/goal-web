import dayjs from 'dayjs'

export function getTimeFromSeconds(seconds: number): string {
    const t = dayjs.duration(seconds, 'seconds')

    if (Number(t.format('ss')) <= 0) return `${t.format("m'")}`

    return t.format("m'ss''")
}
