import { Component } from 'solid-js'

import { BreadcrumbItemProps } from './types'

const BreadcrumbItem: Component<BreadcrumbItemProps> = ({ item, onClick }) => {
    return (
        <button
            disabled={item.buttonDisabled}
            class="bg-black rounded-md px-2 py-1 text-sm"
            onClick={() => onClick(item.key)}
        >
            {item.label}
        </button>
    )
}

export default BreadcrumbItem
