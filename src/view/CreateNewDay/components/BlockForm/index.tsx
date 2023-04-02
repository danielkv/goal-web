import { Component, For, Match, Switch, createEffect, createSignal } from 'solid-js'

import TextInput from '@components/TextInput'
import { Block, BlockType, EventBlock, RestBlock, TextBlock } from '@models/block'

import EventBlockForm from './EventBlockForm'
import RestBlockForm from './RestBlockForm'
import TextBlockForm from './TextBlockForm'
import { TBlockForm, blockTypes } from './config'

export interface BlockFormProps {
    onClickNext(data: TBlockForm): void
    block: Block
}

const BlockForm: Component<BlockFormProps> = (props) => {
    const [type, setType] = createSignal<BlockType>(props.block.type || '')
    const [info, setInfo] = createSignal<string>(props.block.info || '')

    createEffect(() => {
        setType(props.block.type)
        setInfo(props.block.info || '')
    })

    const handleSubmit = (values: TBlockForm) => {
        props.onClickNext(values)
    }

    return (
        <>
            <div class="flex flex-col">
                <label class="text-sm mb-2">Tipo de bloco</label>
                <select class="input input-full" onChange={(e) => setType((e.target as any).value)}>
                    <For each={blockTypes}>
                        {(item) => (
                            <option value={item.key} selected={type() === item.key}>
                                {item.label}
                            </option>
                        )}
                    </For>
                </select>
            </div>

            <TextInput
                onChange={(e) => setInfo((e.target as any).value)}
                class="flex-1"
                label="Bloco de informação"
                name="info"
                value={info()}
            />

            <Switch>
                <Match when={type() === 'event'}>
                    <EventBlockForm
                        block={props.block as EventBlock}
                        onClickNext={(eventBlock) => {
                            if (eventBlock.event_type !== 'emom') {
                                handleSubmit({
                                    type: 'event',
                                    event_type: eventBlock.event_type,
                                    rounds: eventBlock.rounds,
                                    timecap: eventBlock.timecap || 0,
                                    info: info(),
                                    name: eventBlock.name,
                                })
                            } else {
                                handleSubmit({
                                    type: 'event',
                                    event_type: eventBlock.event_type,
                                    rounds: eventBlock.rounds,
                                    each: eventBlock.each || 0,
                                    for: eventBlock.for || 0,
                                    info: info(),
                                    name: eventBlock.name,
                                })
                            }
                        }}
                    />
                </Match>
                <Match when={type() === 'rest'}>
                    <RestBlockForm
                        block={props.block as RestBlock}
                        onClickNext={(restBlock) => {
                            handleSubmit({ ...restBlock, type: 'rest', info: info() || undefined })
                        }}
                    />
                </Match>
                <Match when={type() === 'text'}>
                    <TextBlockForm
                        block={props.block as TextBlock}
                        onClickNext={(textBlock) => {
                            handleSubmit({ ...textBlock, type: 'text', info: info() || undefined })
                        }}
                    />
                </Match>
            </Switch>
        </>
    )
}

export default BlockForm
