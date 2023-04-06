import { Path } from '@view/CreateNewDay/types'

export interface Controllable<T> {
    onAdd?(path: Path, initialValues: any, override?: Partial<T>): void
    onRemove?(path: Path, override?: Partial<T>): void
    onClickPeace?(key: Path): void
}

export interface WorksheetPeace<T> extends Controllable<T> {
    currentPath?: Path
    item: T
    thisPath: Path
}
