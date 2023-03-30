import { Component, createEffect, createMemo, createSignal, on } from 'solid-js'
import { createStore } from 'solid-js/store'
import Breadcrumb from '../../../../common/components/Breadcrumb'

const [items, setItems] = createStore([
    { key: 'day', label: 'Dia' },
    { key: 'group', label: 'Grupo' },
])

const Form: Component = () => {
    return (
        <>
            <div class="flex flex-1 flex-col overflow-auto">
                <div class="flex flex-col p-8 gap-6">
                    <Breadcrumb items={items} />

                    <form class="flex flex-col gap-6">
                        <input placeholder="Nome" class="input input-full" />
                        <select class="input">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>
                        <div class="section-title">Rounds</div>
                        <div class="paper flex flex-col gap-6">
                            <input placeholder="Nome" class="input input-full" />
                            <div class="flex gap-6">
                                <input placeholder="Nome" class="input input-full" />
                                <input placeholder="Nome" class="input w-32" />
                            </div>
                            <button
                                class="btn btn-light self-end"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setItems((current) => [
                                        ...current,
                                        { key: 'day', label: 'Dia' },
                                    ])
                                }}
                            >
                                Remover
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="paper flex flex-col gap-6 rounded-none">
                <button class="btn btn-main">Finalizar</button>
            </div>
        </>
    )
}

export default Form
