import { Component, createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import Emom from '@components/Emom'
import Header from '@components/Header'
import Regressive from '@components/Regressive'
import Stopwatch from '@components/Stopwatch'
import Tabata from '@components/Tabata'
import { Route, Routes } from '@solidjs/router'
import { initialLoadUseCase } from '@useCases/app/initialLoad'
import Home from '@view/Home'
import LoginPage from '@view/Login'
import Preview from '@view/Preview'
import WorksheetList from '@view/WorksheetList'

import CreateNewDay from '../view/CreateNewDay'

const AppRouter: Component = () => {
    const [loading, setLoading] = createSignal(true)

    initialLoadUseCase().finally(() => {
        setLoading(false)
    })

    return (
        <>
            {loading() ? (
                <div class="w-full h-full flex items-center justify-center">
                    <ActivityIndicator color="#fff" size={40} />
                </div>
            ) : (
                <div class="h-full">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/worksheet" element={<WorksheetList />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/worksheet/new" element={<CreateNewDay />} />
                        <Route path="/worksheet/view/:id" element={<Preview />} />
                        <Route path="/worksheet/:id" element={<CreateNewDay />} />

                        <Route path="/worksheet/stopwatch" element={<Stopwatch />} />
                        <Route path="/worksheet/regressive" element={<Regressive />} />
                        <Route path="/worksheet/emom" element={<Emom />} />
                        <Route path="/worksheet/tabata" element={<Tabata />} />
                    </Routes>
                </div>
            )}
        </>
    )
}

export default AppRouter
