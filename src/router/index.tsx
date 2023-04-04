import { Component, createEffect } from 'solid-js'

import Header from '@components/Header'
import { loggedUser } from '@contexts/user/user.context'
import { Route, Routes, useNavigate } from '@solidjs/router'
import LoginPage from '@view/Login'

import CreateNewDay from '../view/CreateNewDay'

const AppRouter: Component = () => {
    const navigate = useNavigate()

    createEffect(() => {
        if (loggedUser()) navigate('/', { replace: true })
        else navigate('/login', { replace: true })
    })

    return (
        <div class="h-full">
            <Header />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<CreateNewDay />} />
            </Routes>
        </div>
    )
}

export default AppRouter
