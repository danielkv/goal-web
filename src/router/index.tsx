import { Component } from 'solid-js'

import { Route, Routes } from '@solidjs/router'

import Header from '../common/components/Header'
import CreateNewDay from '../view/CreateNewDay'

const AppRouter: Component = () => {
    return (
        <div class="h-full">
            <Header />

            <Routes>
                <Route path="/create-day" element={<CreateNewDay />} />
            </Routes>
        </div>
    )
}

export default AppRouter
