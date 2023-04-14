import { Component } from 'solid-js'

import Emom from '@components/Emom'
import Regressive from '@components/Regressive'
import Stopwatch from '@components/Stopwatch'
import Tabata from '@components/Tabata'

const Home: Component<{}> = () => {
    return (
        <>
            <Stopwatch />
            <Regressive />
            <Emom />
            <Tabata />
        </>
    )
}

export default Home
