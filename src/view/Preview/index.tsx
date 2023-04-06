import { jsPDF } from 'jspdf'

import { Component, Suspense, createResource } from 'solid-js'

import WorksheetPreview from '@components/WorksheetPreview'
import { WorksheetModel } from '@models/day'
import { useParams } from '@solidjs/router'
import { getWorksheetByIdUseCase } from '@useCases/worksheet/getWorksheetById'

const Preview: Component<{}> = (props) => {
    const params = useParams()

    const [worksheet] = createResource(params.id, getWorksheetByIdUseCase)

    let ref: HTMLDivElement

    function generatePDF() {
        const pdf = new jsPDF('p', 'pt', 'letter')
        const period = ref.querySelector('.period')
        if (!period) return
        pdf.html(ref as HTMLElement, {
            callback: function (pdf) {
                pdf.save()
            },
            filename: 'pdf.pdf',
            autoPaging: true,
        })
    }

    return (
        <div>
            <Suspense>
                <button class="btn" onClick={() => generatePDF()}>
                    Gerar PDF
                </button>
                {worksheet() ? (
                    <div
                        ref={(e) => {
                            ref = e
                        }}
                    >
                        <WorksheetPreview item={worksheet() as WorksheetModel} />
                    </div>
                ) : null}
            </Suspense>
        </div>
    )
}

export default Preview
