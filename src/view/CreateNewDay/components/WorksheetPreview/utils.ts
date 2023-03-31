import { MovementWeight } from '@models/block'

export function displayWeight(weight?: MovementWeight): string {
    if (!weight?.value || weight.type === 'none') return ''

    return ` - ${weight.value}${weight.type}`
}
