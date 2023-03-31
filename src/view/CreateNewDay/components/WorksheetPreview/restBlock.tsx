import dayjs from 'dayjs'

import { Component } from 'solid-js'

import { RestBlock } from '@models/block'

export interface EventBlockPreviewProps {
    block: RestBlock
}
const RestBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return (
        <div>
            {dayjs.duration(props.block.time, 'seconds').format("mm'ss''")} Rest - \
            {props.block.text && <span>{props.block.text}</span>}
        </div>
    )
}

export default RestBlockPreview
