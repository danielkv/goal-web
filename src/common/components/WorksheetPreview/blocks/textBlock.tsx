import { Component } from 'solid-js'

import { WorksheetPeace } from '@interfaces/preview'
import { ITextBlock } from '@models/block'
import { Stack } from '@suid/material'

export interface EventBlockPreviewProps extends WorksheetPeace<ITextBlock> {}

const TextBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return <Stack class="bg-gray-800 rounded-xl text-sm p-3 font-bold">{props.item.text}</Stack>
}

export default TextBlockPreview
