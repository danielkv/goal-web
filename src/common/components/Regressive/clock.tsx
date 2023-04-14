import dayjs from 'dayjs'
import { FiPlay, FiSkipBack, FiSquare } from 'solid-icons/fi'

import { Component, createSignal } from 'solid-js'

import { RegressiveTimer } from '@utils/timer'

export interface RegressiveProps {
    initialTime: number // seconds
}

const RegressiveClock: Component<RegressiveProps> = (props) => {
    const [currentTime, setCurrentTime] = createSignal(props.initialTime)
    const [currentStatus, setCurrentStatus] = createSignal('initial')

    const clock = new RegressiveTimer(props.initialTime)

    clock.on('changeStatus', (status) => {
        setCurrentStatus(status)
    })

    clock.on('tick', (duration: number, start, current) => {
        setCurrentTime(duration)
    })

    clock.on('reset', () => {
        setCurrentTime(props.initialTime)
    })

    return (
        <div class="flex flex-col items-center p-6">
            <h2 class="text-gray-700 font-bold text-lg">Cronometro Regressivo</h2>
            <h3 class="text-gray-700 text-sm">Tempo</h3>
            <div class="text-center text-gray-700 text-[40pt] font-bold">
                {dayjs.duration(currentTime(), 'second').format('mm:ss')}
            </div>

            <div>
                <button
                    class="bg-gray-100 p-3 rounded-full hover:bg-gray-600"
                    onClick={() => {
                        if (currentStatus() !== 'running') clock.start()
                        else clock.stop()
                    }}
                >
                    {currentStatus() === 'running' ? <FiSquare size={40} /> : <FiPlay size={40} />}
                </button>
                <button class="bg-gray-100 p-3 rounded-full hover:bg-gray-600" onClick={() => clock.reset()}>
                    <FiSkipBack size={40} />
                </button>
            </div>
        </div>
    )
}

export default RegressiveClock
