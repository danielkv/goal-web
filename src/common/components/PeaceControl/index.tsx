import { FiCopy, FiPlus, FiTrash2 } from 'solid-icons/fi'

import { Component } from 'solid-js'

export interface PeaceControlProps {
    onClickRemove?(): void
    onClickTopAdd?(): void
    onClickBottomAdd?(): void
    onClickTopDuplicate?(): void
    onClickBottomDuplicate?(): void
}

const PeaceControl: Component<PeaceControlProps> = (props) => {
    return (
        <>
            <button class="icon-btn remove" onClick={props.onClickRemove}>
                <FiTrash2 />
            </button>

            <button class="icon-btn add top" onClick={props.onClickTopAdd}>
                <FiPlus />
            </button>

            <button class="icon-btn add bottom" onClick={props.onClickBottomAdd}>
                <FiPlus />
            </button>

            <button class="icon-btn duplicate top" onClick={props.onClickTopDuplicate}>
                <FiCopy />
            </button>

            <button class="icon-btn duplicate bottom" onClick={props.onClickBottomDuplicate}>
                <FiCopy />
            </button>
        </>
    )
}

export default PeaceControl
