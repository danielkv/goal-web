import { Day } from 'src/common/models/day'
import { Paths } from 'src/common/types/app'

import { Component } from 'solid-js'

import Breadcrumb from '../../../../common/components/Breadcrumb'
import DayForm from '../DayForm'
import EventBlockForm from '../EventBlockForm'
import GroupForm from '../GroupForm'
import RestBlockForm from '../RestBlockForm'
import RoundForm from '../RoundForm'
import TextBlockForm from '../TextBlockForm'

type T = Paths<Day>

const Form: Component = () => {
    return (
        <>
            <div class="flex flex-1 flex-col overflow-auto">
                <div class="flex flex-col p-8 gap-6">
                    <Breadcrumb items={[{ key: 'day', label: 'Dia', buttonDisabled: true }]} />

                    {/* <DayForm onClickNext={() => {}} /> */}

                    {/* <GroupForm onClickNext={() => {}} />  */}

                    {/* <EventBlockForm onClickNext={() => {}} /> */}

                    {/* <RoundForm onClickNext={() => {}} /> */}

                    {/* <RestBlockForm onClickNext={() => {}} /> */}
                    <TextBlockForm onClickNext={() => {}} />
                </div>
            </div>
            <div class="paper flex flex-col gap-6 rounded-none">
                <button class="btn btn-main">Finalizar</button>
            </div>
        </>
    )
}

export default Form
