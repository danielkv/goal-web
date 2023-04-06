import { Component, Suspense, createResource } from 'solid-js'

import WorksheetPreview from '@components/WorksheetPreview'
import { WorksheetModel } from '@models/day'
import { useParams } from '@solidjs/router'
import { getWorksheetByIdUseCase } from '@useCases/worksheet/getWorksheetById'

const Preview: Component<{}> = (props) => {
    const params = useParams()

    const [worksheet] = createResource(params.id, getWorksheetByIdUseCase)

    return (
        <div>
            <Suspense>
                {worksheet() ? <WorksheetPreview item={worksheet() as WorksheetModel} /> : null}
            </Suspense>
        </div>
    )
}

export default Preview
