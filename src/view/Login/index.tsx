import { auth as authUI } from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

import { Component, createEffect } from 'solid-js'

import { firebaseProvider } from '@common/providers/firebase'
import { useNavigate } from '@solidjs/router'

const LoginPage: Component = () => {
    const navigate = useNavigate()

    createEffect(() => {
        const ui = authUI.AuthUI.getInstance() || new authUI.AuthUI(firebaseProvider.getAuth())
        ui.start('#loginForm', {
            signInOptions: firebaseProvider.signInOptions,
            callbacks: {
                signInSuccessWithAuthResult: (auth) => {
                    console.log(auth)

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
