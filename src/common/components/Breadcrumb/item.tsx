import { Component } from 'solid-js'
import { BreadcrumbItemProps } from './types'

const BreadcrumbItem: Component<BreadcrumbItemProps> = ({ item, onClick }) => {
    return (
        <button class="bg-black rounded-md px-3 py-1" onClick={() => onClick(item.key)}>
            {item.label}
        </button>
    )
}

export default BreadcrumbItem
