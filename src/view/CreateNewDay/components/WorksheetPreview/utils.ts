import { MovementWeight } from '@models/block'
import { getRoundsDisplay } from '@view/CreateNewDay/utils'

export function displayWeight(weight?: MovementWeight): string {
    if (!weight?.value || weight.type === 'none') return ''

    const value = getRoundsDisplay(weight.value, `${weight.type} `)

    return ` - ${value}${weight.type}`
}
