import { User } from 'firebase/auth'

import { Component, onCleanup } from 'solid-js'

import { firebaseProvider } from '@common/providers/firebase'
import { setLoggedUser } from '@contexts/user/user.context'
import { useLocation, useNavigate } from '@solidjs/router'
import { ThemeProvider, createTheme } from '@suid/material'
import { extractUserCredential } from '@utils/users'

import AppRouter from './router'

const App: Component = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    })

    function handleAuthStateChanged(user: User | null) {
        if (!user || !user?.displayName || !user?.email) return setLoggedUser(null)

        setLoggedUser(extractUserCredential(user))

        if (location.pathname === '/login') navigate('worksheet')
    }

    const unsubscribe = firebaseProvider.getAuth().onAuthStateChanged(handleAuthStateChanged)

    onCleanup(() => {
        unsubscribe()
    })

    return (
        <ThemeProvider theme={darkTheme}>
            <AppRouter />
        </ThemeProvider>
    )
}

export default App
