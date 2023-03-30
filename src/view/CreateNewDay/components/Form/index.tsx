import { Component } from 'solid-js'

import Breadcrumb from '../../../../common/components/Breadcrumb'
import DayForm from '../DayForm'
import EventBlockForm from '../EventBlockForm'
import GroupForm from '../GroupForm'

const Form: Component = () => {
    return (
        <>
            <div class="flex flex-1 flex-col overflow-auto">
                <div class="flex flex-col p-8 gap-6">
                    <Breadcrumb items={[{ key: 'day', label: 'Dia', buttonDisabled: true }]} />

                    {/* <DayForm onClickNext={() => {}} />

                    <GroupForm onClickNext={() => {}} /> */}

                    <EventBlockForm onClickNext={() => {}} />

                    <div class="section-title">Rounds</div>
                    <div class="paper flex flex-col gap-6">
                        <input placeholder="Nome" class="input input-full" />
                        <div class="flex gap-6">
                            <input placeholder="Nome" class="input input-full" />
                            <input placeholder="Nome" class="input w-32" />
                        </div>
                        <button class="btn btn-light self-end">Remover</button>
                    </div>
                </div>
            </div>
            <div class="paper flex flex-col gap-6 rounded-none">
                <button class="btn btn-main">Finalizar</button>
            </div>
        </>
    )
}

export default Form
