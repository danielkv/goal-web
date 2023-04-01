import { Component } from 'solid-js'

import Header from '@components/Header'
import { Route, Routes } from '@solidjs/router'

import CreateNewDay from '../view/CreateNewDay'

const AppRouter: Component = () => {
    return (
        <div class="h-full">
            <Header />
            <Routes>
                <Route path="/" element={<CreateNewDay />} />
            </Routes>
        </div>
    )
}

export default AppRouter
