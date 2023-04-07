import { Component, createSignal } from 'solid-js'

import Header from '@components/Header'
import { Route, Routes } from '@solidjs/router'
import { initialLoadUseCase } from '@useCases/app/initialLoad'
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
                <div>Carregango...</div>
            ) : (
                <div class="h-full">
                    <Header />
                    <Routes>
                        <Route path="/" element={<WorksheetList />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/worksheet/new" element={<CreateNewDay />} />
                        <Route path="/worksheet/view/:id" element={<Preview />} />
                        <Route path="/worksheet/:id" element={<CreateNewDay />} />
                    </Routes>
                </div>
            )}
        </>
    )
}

export default AppRouter
