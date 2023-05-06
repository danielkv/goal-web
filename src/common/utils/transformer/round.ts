import { IRound } from '@models/block'

import { MovementTransformer, movementTransformer } from './movement'

export class RoundTransformer {
    private breakline = '\n'
    constructor(private movementTransformer: MovementTransformer) {}

    toObject(text: string): IRound {
        const textMovements = text.split(this.breakline)

        const movements = textMovements.map((t) => this.movementTransformer.toObject(t))

        return {
            type: 'not_timed',
            movements,
        }
    }

    toString(obj: IRound): string {
        return obj.movements.map((o) => this.movementTransformer.toString(o)).join(this.breakline)
    }
}

export const roundTransformer = new RoundTransformer(movementTransformer)
