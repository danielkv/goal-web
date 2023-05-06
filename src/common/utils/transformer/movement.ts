import { IEventMovement, TWeightTypes } from '@models/block'

export class MovementTransformer {
    toObject(text: string): IEventMovement {
        const regex =
            /^((?<reps>(?:\d+(?:[\d\-\*\,\/\sa\?]*(?:\d|\?))?)?)((?<reps_type>x|m|km|s|min)\s|\s)+)(?<name>[a-zA-Z\u00C0-\u00FF\s\'\d\+]+[A-Z])+(?:\s\-\s(?<weight>(?:\d+(?:[\d\-\*\,\/\sa\?]*(?:\d|\?))?)?)(?<weight_type>kg|%|lb)+)?$/i

        const match = text.match(regex)
        if (!match?.groups) return { name: text.trim(), reps: '' }

        return {
            name: match.groups.name.trim(),
            reps: `${match.groups.reps.trim()}${match.groups.reps_type || ''}`,
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
}

export const movementTransformer = new MovementTransformer()
