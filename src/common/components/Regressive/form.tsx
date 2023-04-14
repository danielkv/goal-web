import { FiPlay } from 'solid-icons/fi'

import { Component, createSignal } from 'solid-js'

import { stringTimeToSeconds } from '@utils/time'

export interface RegressiveFormProps {
    handleNext(time: number): void
}
const RegressiveForm: Component<RegressiveFormProps> = (props) => {
    const [minuteTime, setMinuteTime] = createSignal(0)
    const [secondTime, setSecondTime] = createSignal(0)

    return (
        <div class="flex flex-col items-center p-6">
            <h2 class="text-gray-700 font-bold text-lg">Defina qual o tempo</h2>

            <div class="text-center text-gray-700 text-[40pt] font-bold">
                <input
                    name="minute"
                    class="bg-[transparent] w-16 text-center removeArrows outline-none"
                    max={99}
                    type="number"
                    onInput={(e) => {
                        setMinuteTime(Number((e.target as any).value))
                    }}
                    value={minuteTime()}
                />
                :
                <input
                    name="second"
                    class="bg-[transparent] w-16 text-center removeArrows outline-none"
                    type="number"
                    onInput={(e) => {
                        setSecondTime(Number((e.target as any).value))
                    }}
                    value={secondTime()}
                />
            </div>
            <button
                class="bg-gray-100 p-3 rounded-full hover:bg-gray-600"
                onClick={() => {
                    const time = stringTimeToSeconds(`${minuteTime()}:${secondTime()}`)
                    console.log(time)
                    props.handleNext(time)
                }}
            >
                <FiPlay size={40} />
            </button>
        </div>
    )
}

export default RegressiveForm
