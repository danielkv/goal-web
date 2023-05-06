import { IEventRound } from '@models/block'

import { MovementTransformer, movementTransformer } from './movement'

export class RoundTransformer {
    private breakline = '\n'
    constructor(private movementTransformer: MovementTransformer) {}

    toObject(text: string): IEventRound {
        const textMovements = text.split(this.breakline)

        const movements = textMovements.map((t) => this.movementTransformer.toObject(t))

        return {
            name: '',
            movements,
        }
    }

    toString(obj: IEventRound): string {
        return obj.movements.map((o) => this.movementTransformer.toString(o)).join(this.breakline)
    }
}

export const roundTransformer = new RoundTransformer(movementTransformer)
