import { Routes, Route } from '@solidjs/router'
import { Component } from 'solid-js'
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
