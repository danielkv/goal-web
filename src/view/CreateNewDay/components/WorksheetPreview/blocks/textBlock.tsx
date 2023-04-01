import { Component } from 'solid-js'

import { TextBlock } from '@models/block'

export interface EventBlockPreviewProps {
    block: TextBlock
}
const TextBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return <div>{props.block.text}</div>
}

export default TextBlockPreview
