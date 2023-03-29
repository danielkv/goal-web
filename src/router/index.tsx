import { Routes, Route } from '@solidjs/router'
import { Component } from 'solid-js'
import Header from '../common/components/Header'
import CreateNewDay from '../view/CreateNewDay'

const AppRouter: Component = () => {
    return (
        <div class="flex flex-col h-full">
            <Header />
            <div class="flex grow">
                <Routes>
                    <Route path="/create-day" element={<CreateNewDay />} />
                </Routes>
            </div>
        </div>
    )
}

export default AppRouter
