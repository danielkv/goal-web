export function removeNull(obj: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, value]) => !value)
            .map(([key, value]) => [key, value === Object(value) ? removeNull(value) : value])
    )
}
