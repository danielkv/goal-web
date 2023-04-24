import dayjs from 'dayjs'

import { Component } from 'solid-js'

import LogoSvg from '@assets/logo.svg?component-solid'
import { Worksheet } from '@models/day'

export interface WorksheetItemProps {
    worksheet?: Omit<Worksheet, 'days'>
    onClick(): void
}

const WorksheetItem: Component<WorksheetItemProps> = (props) => {
    return (
        <div class="p-10 hover:bg-gray-700" classList={{ 'cursor-pointer': !!props.onClick }} onClick={props.onClick}>
            <div class="w-32 h-40 shadow-md bg-gray-900 relative">
                <div class="w-2 h-2 bg-red-500"></div>
                <div class="absolute left-1/2 top-1/2 -ml-[20px] -mt-[25px]">
                    <LogoSvg height={50} />
                </div>
            </div>
            <div class="text-center mt-2">
                <h3 class=" font-bold">{props.worksheet?.name || 'Nova planilha'}</h3>
                <h4 class="text-xs">{!!props.worksheet && dayjs(props.worksheet.startDate).format('DD/MM/YYYY')}</h4>
            </div>
        </div>
    )
}

export default WorksheetItem
