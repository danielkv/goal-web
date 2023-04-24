import { Component } from 'solid-js'

import { WorksheetPeace } from '@interfaces/preview'
import { IRestBlock } from '@models/block'
import { getTimeFromSeconds } from '@utils/time'

export interface EventBlockPreviewProps extends WorksheetPeace<IRestBlock> {}

const RestBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return (
        <div>
            {getTimeFromSeconds(props.item.time)} Rest
            {props.item.text && <span> - {props.item.text}</span>}
        </div>
    )
}

export default RestBlockPreview
