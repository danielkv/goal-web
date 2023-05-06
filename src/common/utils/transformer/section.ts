import { IBlock } from '@models/block'

import { EventBlockTransformer, blockTransformer } from './eventblock'
import { RestBlockTransformer, restBlockTransformer } from './restBlock'
import { TextBlockTransformer, textBlockTransformer } from './textBlock'

export class SectionTransformer {
    private breakline = '\n-\n'
    constructor(
        private blockTransformer: EventBlockTransformer,
        private restBlockTransformer: RestBlockTransformer,
        private textBlockTransformer: TextBlockTransformer
    ) {}

    toObject(text: string): IBlock[] {
        const textBlocks = text.split(this.breakline)

        return textBlocks.map((t) => this.typeToObject(t))
    }

    toString(objs: IBlock[]): string {
        return objs
            .map((obj) => {
                switch (obj.type) {
                    case 'event':
                        return this.blockTransformer.toString(obj)
                    case 'rest':
                        return this.restBlockTransformer.toString(obj)
                    case 'text':
                        return this.textBlockTransformer.toString(obj)
                    default:
                        return ''
                }
            })
            .join(this.breakline)
    }

    private typeToObject(text: string): IBlock {
        const matchRest = this.restBlockTransformer.toObject(text)
        if (matchRest) return matchRest

        const matchText = this.textBlockTransformer.toObject(text)
        if (matchText) return matchText

        const matchEvent = blockTransformer.toObject(text)
        if (matchEvent) return matchEvent

        return {
            type: 'text',
            text: text.trim(),
        }
    }
}

export const sectionTransformer = new SectionTransformer(blockTransformer, restBlockTransformer, textBlockTransformer)