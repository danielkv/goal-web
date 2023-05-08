import { IEventMovement, TMovementWeight, TWeightTypes } from '@models/block'
import { numberHelper } from '@utils/numbers'

export class MovementTransformer {
    toObject(text: string): IEventMovement {
        const regex =
            /^(?<reps>((?<reps_number>(?:\d+(?:[\d\-\*\,\/\sa\?]*(?:\d|\?))?)?)((?<reps_type>x|m|km|s|mi|min|sec)\s|\s)+)|max)(?<name>[a-zA-Z\u00C0-\u00FF\s\'\d\+]+[A-Z])+(?:\s\-\s(?<weight>(?:\d+(?:[\d\-\*\,\/\sa\?]*(?:\d|\?))?)?)(?<weight_type>kg|%|lb)+)?$/i

        const match = text.match(regex)
        if (!match?.groups) return { name: text.trim(), reps: '' }

        const reps = match.groups.reps_number
            ? `${match.groups.reps_number.trim()}${match.groups.reps_type || ''}`
            : match.groups.reps

        return {
            name: match.groups.name.trim(),
            reps,
            weight: match.groups.weight
                ? {
                      value: match.groups.weight.trim(),
                      type: match.groups.weight_type.trim() as TWeightTypes,
                  }
                : undefined,
        }
    }

    toString(obj: IEventMovement): string {
        const weight = obj.weight ? ` - ${obj.weight.value}${obj.weight.type}` : ''
        const reps = obj.reps ? `${obj.reps.trim()} ` : ''

        return `${reps}${obj.name}${weight}`
    }

    displayWeight(weight?: TMovementWeight): string {
        if (!weight?.value || weight.type === 'none') return ''

        const value = numberHelper.convertNumbers(weight.value, { suffix: '', separator: `${weight.type} ` })

        return ` - ${value.trim()}${weight.type}`
    }

    displayMovement(obj: IEventMovement) {
        const reps = this.displayReps(obj)
        const displayMovement = `${reps}${obj.name}`

        return displayMovement
    }

    display(obj: IEventMovement) {
        const weight = this.displayWeight(obj.weight)
        const movement = this.displayMovement(obj)

        return `${movement}${weight}`
    }

    private displayReps(obj: IEventMovement) {
        const reps = numberHelper.convertNumbers(obj.reps, { suffix: '' })
        const repsDisplay = reps && reps !== '0' ? `${reps} ` : ''
        return repsDisplay
    }
}

export const movementTransformer = new MovementTransformer()
