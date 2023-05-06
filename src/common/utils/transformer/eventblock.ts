import { IEventBlock } from '@models/block'

import { RoundTransformer, roundTransformer } from './round'

export class EventBlockTransformer {
    private breakline = '\n\n'
    constructor(private roundTransformer: RoundTransformer) {}

    toObject(text: string): IEventBlock | null {
        const textRounds = text.split(this.breakline)
        if (!textRounds.length) return null

        const rounds = textRounds.map((t) => this.roundTransformer.toObject(t))

        return {
            type: 'event',
            event_type: 'for_time',
            rounds,
            timecap: 0,
        }
    }

    toString(obj: IEventBlock): string {
        return obj.rounds.map((o) => this.roundTransformer.toString(o)).join(this.breakline)
    }

    //private checkMath(text: s)
}

export const blockTransformer = new EventBlockTransformer(roundTransformer)
