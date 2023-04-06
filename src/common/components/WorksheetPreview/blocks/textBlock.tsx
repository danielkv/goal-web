import { Component } from 'solid-js'

import { WorksheetPeace } from '@interfaces/preview'
import { TextBlock } from '@models/block'

export interface EventBlockPreviewProps extends WorksheetPeace<TextBlock> {}

const TextBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return <div>{props.item.text}</div>
}

export default TextBlockPreview
