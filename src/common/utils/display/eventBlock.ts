import { IEventBlock, IEventBlockEMOM, IEventBlockTabata, IEventBlockTimecap } from '@models/block'
import { eventTypes } from '@utils/worksheetInitials'

import { BaseDisplay } from './base'

export class EventBlockDisplay extends BaseDisplay {
    displayTitle(block: IEventBlock): string {
        const time =
            block.event_type === 'amrap' ||
            block.event_type === 'for_time' ||
            block.event_type === 'emom' ||
            block.event_type === 'max_weight' ||
            block.event_type === 'tabata'
                ? this.displayEventTimer(block) || ''
                : ''

        const numberOfRounds = !time ? super.displayNumberOfRounds(block.numberOfRounds, 'x', 'Repetir') : ''
        const type = block.event_type && block.event_type != 'not_timed' ? eventTypes[block.event_type] : ''

        if (!numberOfRounds && !type) return ''
        return this.displayArray([numberOfRounds, type, time])
    }

    private displayEventTimer(block: IEventBlockTimecap | IEventBlockEMOM | IEventBlockTabata): string {
        switch (block.event_type) {
            case 'emom':
                return super.displayTimer('emom', block.numberOfRounds, block.each)
            case 'tabata':
                return super.displayTimer('tabata', block.numberOfRounds, block.work, block.rest)
            case 'max_weight':
                return super.displayTimer('for_time', block.numberOfRounds, block.timecap)
            default:
                return super.displayTimer(block.event_type, block.numberOfRounds, block.timecap)
        }
    }
}

export const eventBlockDisplay = new EventBlockDisplay()
