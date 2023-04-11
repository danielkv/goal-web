import { TPeaces } from '@models/day'
import { Path } from '@view/CreateNewDay/types'

export interface Controllable {
    onAdd?(path: Path, initialValues: TPeaces): void
    onRemove?(path: Path): void
    onMove?(path: Path, to: 'up' | 'down'): void
    onClickPeace?(key: Path): void
}

export interface WorksheetPeace<T> extends Controllable {
    currentPath?: Path
    item: T
    thisPath: Path
}
