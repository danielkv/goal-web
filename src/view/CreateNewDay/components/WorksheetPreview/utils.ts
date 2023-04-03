import { produce } from 'solid-js/store'

import { MovementWeight } from '@models/block'
import { Day, Period } from '@models/day'
import {
    initialDayValues,
    initialPeriodValues,
    setCurrentPath,
    setWorksheetStore,
} from '@view/CreateNewDay/config'
import { getRoundsDisplay } from '@view/CreateNewDay/utils'

export function displayWeight(weight?: MovementWeight): string {
    if (!weight?.value || weight.type === 'none') return ''

    const value = getRoundsDisplay(weight.value, `${weight.type} `)

    return ` - ${value}${weight.type}`
}

export const handleRemoveDay = (dayIndex: number) => {
    setWorksheetStore(
        produce((current) => {
            current.days.splice(dayIndex, 1)

            return current
        })
    )
    setTimeout(() => {
        setCurrentPath(`worksheet`)
    }, 1)
}

export const handleAddDay = (dayIndex: number, override?: Partial<Day>) => {
    setWorksheetStore(
        produce((current) => {
            current.days.splice(dayIndex, 0, { ...initialDayValues, ...override })

            return current
        })
    )
    setTimeout(() => {
        setCurrentPath(`worksheet.days.${dayIndex}`)
    }, 1)
}

export const handleRemovePeriod = (dayIndex: number, periodIndex: number) => {
    setWorksheetStore(
        produce((current) => {
            current.days[dayIndex].periods.splice(periodIndex, 1)

            return current
        })
    )
    setTimeout(() => {
        setCurrentPath(`worksheet.days.${dayIndex}`)
    }, 1)
}
export const handleAddPeriod = (
    dayIndex: number,
    periodIndex: number,
    override?: Partial<Period>
) => {
    setWorksheetStore(
        produce((current) => {
            current.days[dayIndex].periods.splice(periodIndex, 0, {
                ...initialPeriodValues,
                ...override,
            })

            return current
        })
    )
    setTimeout(() => {
        setCurrentPath(`worksheet.days.${dayIndex}.periods.${periodIndex}`)
    }, 1)
}
