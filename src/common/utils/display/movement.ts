import { IEventMovement, IMovementWeight } from '@models/block'
import { numberHelper } from '@utils/numbers'

import { BaseDisplay } from './base'

export class MovementDisplay extends BaseDisplay {
    weightToString(weight?: IMovementWeight): string {
        const r = this.displayArray([weight?.value, weight?.type], '')

        return r
    }

    displayWeight(weight?: IMovementWeight): string {
        if (!weight?.value || weight.type === 'none') return ''

        const value = numberHelper.convertNumbers(weight.value, { suffix: '', separator: `${weight.type} ` })

        return this.displayArray([value.trim(), weight.type], '')
    }

    displayMovement(obj: IEventMovement, hideReps?: boolean) {
        const reps = this.displayReps(obj)
        const displayMovement = `${!hideReps ? reps : ''}${obj.name}`

        return displayMovement
    }

    display(obj: IEventMovement, hideReps?: boolean) {
        const weight = this.displayWeight(obj.weight)
        const movement = this.displayMovement(obj, hideReps)

        return this.displayArray([movement, weight], ' - ')
    }

    private displayReps(obj: IEventMovement) {
        const reps = numberHelper.convertNumbers(obj.reps, { suffix: '' })
        const repsDisplay = reps || ''
        return repsDisplay
    }
}

export const movementDisplay = new MovementDisplay()
