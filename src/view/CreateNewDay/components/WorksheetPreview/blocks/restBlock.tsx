import { Component } from 'solid-js'

import { RestBlock } from '@models/block'
import { getTimeFromSeconds } from '@utils/time'

export interface EventBlockPreviewProps {
    block: RestBlock
}
const RestBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return (
        <div>
            {getTimeFromSeconds(props.block.time)} Rest - \
            {props.block.text && <span>{props.block.text}</span>}
        </div>
    )
}

export default RestBlockPreview
