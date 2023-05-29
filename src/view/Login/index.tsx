import { auth as authUI } from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

import { Component, createEffect } from 'solid-js'

import { firebaseProvider } from '@common/providers/firebase'
import { setupFbAuthListener } from '@contexts/user/user.context'
import { useNavigate } from '@solidjs/router'

const LoginPage: Component = () => {
    const navigate = useNavigate()
    setupFbAuthListener()

    createEffect(() => {
        const ui = authUI.AuthUI.getInstance() || new authUI.AuthUI(firebaseProvider.getAuth())
        ui.start('#loginForm', {
            signInOptions: firebaseProvider.signInOptions,
            callbacks: {
                signInSuccessWithAuthResult: () => {
                    navigate('/')
                    return false
                },
            },
        })
    })

    return (
        <div>
            <div id="loginForm" class="mt-20"></div>
        </div>
    )
}

export default LoginPage
