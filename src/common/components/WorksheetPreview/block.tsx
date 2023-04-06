import { Component, Match, Switch, splitProps } from 'solid-js'

import PeaceControl from '@components/PeaceControl'
import { WorksheetPeace } from '@interfaces/preview'
import { Block, EventBlock, RestBlock, TextBlock } from '@models/block'
import { pathToNextIndex } from '@utils/paths'
import { initialBlockValues } from '@utils/worksheetInitials'

import EventBlockPreview from './blocks/eventBlock'
import RestBlockPreview from './blocks/restBlock'
import TextBlockPreview from './blocks/textBlock'

export interface BlockProps extends WorksheetPeace<Block> {}

const BlockPreview: Component<BlockProps> = (props) => {
    const [parentProps] = splitProps(props, ['currentPath', 'onAdd', 'onRemove', 'onClickPeace'])

    return (
        <div
            class="block"
            classList={{
                selected: props.currentPath === props.thisPath,
                empty: props.item.type === '',
                hoverable: !!props.onClickPeace,
            }}
            onClick={(e) => {
                e.stopPropagation()
                props.onClickPeace?.(props.thisPath)
            }}
        >
            {props.onAdd && props.onRemove && (
                <PeaceControl
                    onClickRemove={() => props.onRemove?.(props.thisPath)}
                    onClickTopAdd={() => props.onAdd?.(props.thisPath, initialBlockValues)}
                    onClickBottomAdd={() =>
                        props.onAdd?.(pathToNextIndex(props.thisPath), initialBlockValues)
                    }
                />
            )}
            {props.item.info && <div class="info">{props.item.info}</div>}
            <Switch>
                <Match when={props.item.type === 'rest'}>
                    <RestBlockPreview item={props.item as RestBlock} thisPath={props.thisPath} />
                </Match>
                <Match when={props.item.type === 'text'}>
                    <TextBlockPreview item={props.item as TextBlock} thisPath={props.thisPath} />
                </Match>
                <Match when={props.item.type === 'event'}>
                    <EventBlockPreview
                        item={props.item as EventBlock}
                        thisPath={props.thisPath}
                        {...parentProps}
                    />
                </Match>
            </Switch>
        </div>
    )
}

export default BlockPreview
