import { auth as authUI } from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

import { Component, createEffect } from 'solid-js'

import { FIREBASE_AUTH, signInOptions } from '@common/providers/firebase'
import { setupFbAuthListener } from '@contexts/user/user.context'

const ui = authUI.AuthUI.getInstance() || new authUI.AuthUI(FIREBASE_AUTH)

const LoginPage: Component = () => {
    setupFbAuthListener()

    createEffect(() => {
        ui.start('#loginForm', {
            signInOptions,
            callbacks: {
                signInSuccessWithAuthResult: () => false,
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
