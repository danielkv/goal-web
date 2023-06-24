import { IEventMovement, IMovementWeight, TWeightTypes } from '@models/block'

import { numberHelper } from '../numbers'

import { BaseTransformer } from './base'

export class MovementTransformer extends BaseTransformer {
    constructor() {
        super()
    }

    private videoUrlRegex = /^(?<movement>.+)(?:\s*?\:\s*?(?<video>http.+))$/i

    toObject(text: string, roundReps?: string): IEventMovement {
        const normalizedText = this.normalizeText(text)

        const matchMovementBase = normalizedText.match(this.videoUrlRegex)
        const videoUrl = matchMovementBase?.groups?.video

        const movementBaseText = this.normalizeText(matchMovementBase?.groups?.movement || normalizedText)
        const matchWeightBase = movementBaseText.match(this.weightBaseRegex)

        const movementText = matchWeightBase?.groups?.movement || movementBaseText
        const match = movementText.match(this.movementBaseRegex)

        if (!match?.groups) return { name: movementBaseText, reps: '', videoUrl }

        const reps = this.extractReps(match.groups.reps, roundReps)

        const result: IEventMovement = {
            name: match.groups.name.trim(),
            reps,
            videoUrl,
        }

        const weight = this.extractWeight(matchWeightBase?.groups?.weight)
        if (weight) result.weight = weight

        return result
    }

    protected extractWeight(text?: string): IMovementWeight | undefined {
        if (!text) return undefined

        const match = text.match(this.weightRegex)
        if (!match?.groups?.weight) return undefined

        return {
            value: match.groups.weight.trim(),
            type: match.groups.weight_type.trim() as TWeightTypes,
        }
    }

    protected extractReps(text?: string, roundReps?: string): string {
        if (roundReps) return roundReps

        if (!text) return ''

        const match = text.match(this.repsRegex)
        if (!match?.groups) return text

        const reps = match.groups.reps_number
            ? `${match.groups.reps_number.trim()}${match.groups.reps_type || ''}`
            : match.groups.reps

        return reps
    }

    toString(obj: IEventMovement, hideReps?: boolean): string {
        const weight = this.weightToString(obj.weight)
        const reps = obj.reps && !hideReps ? obj.reps.trim() : ''
        const videoUrl = obj.videoUrl ? `: ${obj.videoUrl}` : ''
        return this.displayArray([reps, obj.name, weight, videoUrl])
    }

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

export const movementTransformer = new MovementTransformer()
