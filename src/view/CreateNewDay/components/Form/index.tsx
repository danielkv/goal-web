import { Component } from 'solid-js'

import Breadcrumb from '@components/Breadcrumb'
import { Paths } from '@interfaces/app'
import { Day } from '@models/day'

import DayForm from '../DayForm'
import GroupForm from '../GroupForm'
import RoundForm from '../RoundForm'
import EventBlockForm from '../blocks/EventBlockForm'
import RestBlockForm from '../blocks/RestBlockForm'
import TextBlockForm from '../blocks/TextBlockForm'

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
