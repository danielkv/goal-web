export interface BreadcrumbProps {
    items: IBreadcrumbItem[]
    onClick?(key: string, hierarchy: string): void
}

export interface BreadcrumbItemProps {
    item: IBreadcrumbItem
    onClick(key: string): void
}

export interface IBreadcrumbItem {
    key: string
    label: string
}
