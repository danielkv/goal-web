import { produce } from 'solid-js/store'

import { Block, EventBlock, EventRound, MovementWeight } from '@models/block'
import { Day, Period } from '@models/day'
import { getTimeFromSeconds } from '@utils/time'
import {
    initialBlockValues,
    initialDayValues,
    initialEventRoundValues,
    initialGroupValues,
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

export const getTimeCap = (block: EventBlock) => {
    if (block.event_type === 'emom') {
        const each = getTimeFromSeconds(block.each)
        const forTime = getTimeFromSeconds(block.for)
        return ` - Cada ${each} por ${forTime}`
    }

    const timecap = getTimeFromSeconds(block.timecap)
    return ` - ${timecap}`
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

export const handleRemoveGroup = (dayIndex: number, periodIndex: number, groupIndex: number) => {
    setWorksheetStore(
        produce((current) => {
            current.days[dayIndex].periods[periodIndex].groups.splice(groupIndex, 1)

            return current
        })
    )
    setTimeout(() => {
        setCurrentPath(`worksheet.days.${dayIndex}.periods.${periodIndex}`)
    }, 1)
}

export const handleAddGroup = (
    dayIndex: number,
    periodIndex: number,
    groupIndex: number,
    override?: Partial<Day>
) => {
    setWorksheetStore(
        produce((current) => {
            current.days[dayIndex].periods[periodIndex].groups.splice(groupIndex, 0, {
                ...initialGroupValues,
                ...override,
            })

            return current
        })
    )
    setTimeout(() => {
        setCurrentPath(`worksheet.days.${dayIndex}.periods.${periodIndex}.groups.${groupIndex}`)
    }, 1)
}

export const handleRemoveBlock = (
    dayIndex: number,
    periodIndex: number,
    groupIndex: number,
    blockIndex: number
) => {
    setWorksheetStore(
        produce((current) => {
            current.days[dayIndex].periods[periodIndex].groups[groupIndex].blocks.splice(
                blockIndex,
                1
            )

            return current
        })
    )
    setTimeout(() => {
        setCurrentPath(`worksheet.days.${dayIndex}.periods.${periodIndex}.groups.${groupIndex}`)
    }, 1)
}

export const handleAddBlock = (
    dayIndex: number,
    periodIndex: number,
    groupIndex: number,
    blockIndex: number,
    override?: Partial<Block>
) => {
    setWorksheetStore(
        produce((current) => {
            current.days[dayIndex].periods[periodIndex].groups[groupIndex].blocks.splice(
                blockIndex,
                0,
                { ...initialBlockValues, ...override } as Block
            )

            return current
        })
    )
    setTimeout(() => {
        setCurrentPath(
            `worksheet.days.${dayIndex}.periods.${periodIndex}.groups.${groupIndex}.blocks.${blockIndex}`
        )
    }, 1)
}

export const handleRemoveRound = (
    dayIndex: number,
    periodIndex: number,
    groupIndex: number,
    blockIndex: number,
    roundIndex: number
) => {
    setWorksheetStore(
        produce((current) => {
            const block =
                current.days[dayIndex].periods[periodIndex].groups[groupIndex].blocks[blockIndex]
            if (block.type === 'event') block.rounds.splice(roundIndex, 1)

            return current
        })
    )
    setTimeout(() => {
        setCurrentPath(`worksheet.days.${dayIndex}.periods.${periodIndex}`)
    }, 1)
}

export const handleAddRound = (
    dayIndex: number,
    periodIndex: number,
    groupIndex: number,
    blockIndex: number,
    roundIndex: number,
    override?: Partial<EventRound>
) => {
    setWorksheetStore(
        produce((current) => {
            const block =
                current.days[dayIndex].periods[periodIndex].groups[groupIndex].blocks[blockIndex]

            if (block.type === 'event')
                block.rounds.splice(roundIndex, 0, { ...initialEventRoundValues, ...override })

            return current
        })
    )
    setTimeout(() => {
        setCurrentPath(
            `worksheet.days.${dayIndex}.periods.${periodIndex}.groups.${groupIndex}.blocks.${blockIndex}.rounds.${roundIndex}`
        )
    }, 1)
}
