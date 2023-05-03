import { IEventMovement, TWeightTypes } from '@models/block'

export function textToMovements(text: string): IEventMovement[] {
    const textMovements = text.split('\n')

    const regex =
        /^((?<reps>(?:\d+(?:[\d\-\*\,\/\sa\?]*(?:\d|\?))?)?)((?<reps_type>x|m|km|s|min)\s|\s)+)(?<name>[a-zA-Z\u00C0-\u00FF\s\'\d\+]+[A-Z])+(?:\s\-\s(?<weight>(?:\d+(?:[\d\-\*\,\/\sa\?]*(?:\d|\?))?)?)(?<weight_type>kg|%|lb)+)?$/i

    const movements = textMovements.map<IEventMovement>((movement) => {
        const match = movement.match(regex)
        if (!match?.groups) return { name: movement.trim(), reps: '' }

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
    })

    return movements
}

export function movementsToText(movements: IEventMovement[]): string {
    return movements
        .map((movement) => {
            const weight = movement.weight ? ` - ${movement.weight.value}${movement.weight.type}` : ''
            const reps = movement.reps ? `${movement.reps.trim()} ` : ''

            return `${reps}${movement.name}${weight}`
        })
        .join('\n')
}
