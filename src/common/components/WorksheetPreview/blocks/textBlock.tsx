import { Component } from 'solid-js'

import { WorksheetPeace } from '@interfaces/preview'
import { ITextBlock } from '@models/block'

export interface EventBlockPreviewProps extends WorksheetPeace<ITextBlock> {}

const TextBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return <div>{props.item.text}</div>
}

export default TextBlockPreview
