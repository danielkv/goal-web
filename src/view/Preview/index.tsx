import html2pdf from 'html2pdf.js'

import { Component, Suspense, createResource } from 'solid-js'

import WorksheetPreview from '@components/WorksheetPreview'
import { WorksheetModel } from '@models/day'
import { useParams } from '@solidjs/router'
import { getWorksheetByIdUseCase } from '@useCases/worksheet/getWorksheetById'

const Preview: Component<{}> = (props) => {
    const params = useParams()

    const [worksheet] = createResource(params.id, getWorksheetByIdUseCase)

    function generatePDF() {
        const html = document.querySelectorAll('.period')
        if (!html) return

        const pdfElement = document.createElement('div')
        pdfElement.classList.add('pdf-page')

        html.forEach((item) => {
            const cloned = item.cloneNode(true)

            pdfElement.appendChild(cloned)
        })

        html2pdf()
            .set({
                html2canvas: {
                    scale: 2,
                },
                jsPDF: {
                    floatPrecision: 'smart',
                    format: 'letter',
                },
            })
            .from(pdfElement)
            .save()
    }

    return (
        <div>
            <Suspense>
                <button class="btn" onClick={() => generatePDF()}>
                    Gerar PDF
                </button>
                {worksheet() ? (
                    <div id="pdfContent">
                        <WorksheetPreview item={worksheet() as WorksheetModel} />
                    </div>
                ) : null}
            </Suspense>
        </div>
    )
}

export default Preview
