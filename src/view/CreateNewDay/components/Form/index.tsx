import { FiChevronsRight } from 'solid-icons/fi'
import { Component } from 'solid-js'

const Form: Component = () => {
    return (
        <>
            <div class="flex flex-1 flex-col overflow-auto">
                <div class="flex flex-col p-8 gap-6">
                    <div class="bg-red-300 h-[700px]"></div>
                    <div class="flex gap-1 items-center">
                        <div class="bg-black rounded-md px-3 py-1">Dia</div>
                        <FiChevronsRight color="black" />
                        <div class="bg-black rounded-md px-3 py-1">Grupo</div>
                        <FiChevronsRight color="black" />
                        <div class="bg-black rounded-md px-3 py-1">Bloco</div>
                    </div>

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
                            <button class="btn btn-light self-end">Remover</button>
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
