import { initializeApp } from 'firebase/app'
import { ProviderId, getAuth } from 'firebase/auth'

export const FIREBASE_APP = initializeApp({
    apiKey: import.meta.env.VITE_APP_APIKEY,
    authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
    projectId: import.meta.env.VITE_APP_PROJECTID,
    storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APP_APPID,
    measurementId: import.meta.env.VITE_APP_MEASUREMENTID,
})

export const FIREBASE_AUTH = getAuth(FIREBASE_APP)

export const signInOptions = [
    {
        provider: ProviderId.PASSWORD,
        fullLabel: 'Login',
        disableSignUp: { status: true },
    },
]
