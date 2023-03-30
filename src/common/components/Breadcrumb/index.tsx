import { FiChevronsRight } from 'solid-icons/fi'

import { Component, For } from 'solid-js'

import BreadcrumbItem from './item'
import { BreadcrumbProps } from './types'

const Breadcrumb: Component<BreadcrumbProps> = ({ items, onClick }) => {
    const handleItemClick = (key: string) => {
        return onClick?.(key)
    }

    return (
        <div class="flex gap-1 items-center">
            <For each={items}>
                {(item, index) => (
                    <>
                        {index() > 0 && <FiChevronsRight color="black" />}
                        <BreadcrumbItem item={item} onClick={handleItemClick} />
                    </>
                )}
            </For>
        </div>
    )
}

export default Breadcrumb
