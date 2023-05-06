import { Component } from 'solid-js'

import { WorksheetPeace } from '@interfaces/preview'
import { IRestBlock } from '@models/block'
import { restBlockTransformer } from '@utils/transformer/restBlock'

export interface EventBlockPreviewProps extends WorksheetPeace<IRestBlock> {}

const RestBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return (
        <div>
            {restBlockTransformer.display(props.item)}
            {props.item.text && <span> - {props.item.text}</span>}
        </div>
    )
}

export default RestBlockPreview
