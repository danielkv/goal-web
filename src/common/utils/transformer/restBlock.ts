import dayjs from 'dayjs'

import { IRestBlock } from '@models/block'
import { getTimeFromSeconds } from '@utils/time'

export class RestBlockTransformer {
    toObject(text: string): IRestBlock | null {
        const regex =
            /(?<time>(?<t1>\d+)(?<type>m|s)(?:(?<t2>\d+)s)?)\s(?:rest)(?:\s\-\s(?<text>[a-zA-Z\u00C0-\u00FF\s\'\d\+]+))?/

        const match = text.match(regex)
        if (!match?.groups?.time) return null

        const minutes = match.groups.type === 'm' ? Number(match.groups.t1) : undefined
        const seconds = match.groups.type === 's' ? Number(match.groups.t1) : Number(match.groups.t2) || undefined

        return {
            type: 'rest',
            time: dayjs.duration({ minutes, seconds }).asSeconds(),
            text: match.groups.text,
        }
    }

    toString(obj: IRestBlock): string {
        const time = getTimeFromSeconds(obj.time)
        const text = obj.text ? ` - ${obj.text}` : ''

        return `${time} Rest${text}`
    }
}

export const restBlockTransformer = new RestBlockTransformer()
