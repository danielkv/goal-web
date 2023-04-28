import dayjs from 'dayjs'

import { Component, For, createMemo, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { IDay, IPeriod } from '@models/day'
import { addToPath, getLastIndex } from '@utils/paths'
import { createPeriodValues } from '@utils/worksheetInitials'

import SectionPreview from './section'

export interface PeriodProps extends WorksheetPeace<IPeriod> {
    day: IDay
}

const PeriodPreview: Component<PeriodProps> = (props) => {
    const [parentProps, controlProps] = splitProps(
        props,
        ['currentPath', 'onAdd', 'onRemove', 'onMove', 'onUpdate', 'onClickPeace'],
        ['onAdd', 'onRemove', 'onMove', 'item', 'thisPath']
    )

    return (
        <div
            class="period"
            classList={{
                selected: props.currentPath === props.thisPath,
                empty: !props.item.sections.length,
                hoverable: !!props.onClickPeace,
            }}
            onClick={(e) => {
                e.stopPropagation()
                props.onClickPeace?.(props.thisPath)
            }}
        >
            {props.onAdd && props.onRemove && props.onMove && (
                <PeaceControl {...controlProps} createInitialValues={createPeriodValues} />
            )}

            <div class="header">
                <div class="period-square">{getLastIndex(props.thisPath) + 1}</div>
                <div class="title">{props.item.name || 'WORKSHEET'}</div>
                <div class="text-right em:mr-6">
                    <small class="flex items-center justify-end gap-3">
                        <span>{dayjs(props.day.date, 'YYYY-MM-DD').format('dddd').toLocaleUpperCase()}</span>

                        {dayjs(props.day.date, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                    </small>
                    <div class="font-bold">{props.day.name}</div>
                </div>
            </div>
            <div class="p-6">
                <For each={props.item.sections}>
                    {(section, sectionIndex) => {
                        const sectionPath = createMemo(() =>
                            addToPath<IPeriod>(props.thisPath, `sections.${sectionIndex()}`)
                        )

                        return <SectionPreview item={section} thisPath={sectionPath()} {...parentProps} />
                    }}
                </For>
            </div>
        </div>
    )
}

export default PeriodPreview
