import { initializeApp } from 'firebase/app'
import { ProviderId, getAuth } from 'firebase/auth'
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'

const useEmulator = import.meta.env.PROD ? false : false

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

export const FUNCTIONS = getFunctions(FIREBASE_APP)

export const signInOptions = [
    {
        provider: ProviderId.PASSWORD,
        fullLabel: 'Login',
        disableSignUp: { status: true },
    },
]

if (useEmulator) connectFunctionsEmulator(FUNCTIONS, 'localhost', 5001)

export const FUNCTION_CALL = <RequestData = unknown, ResponseData = unknown>(fnName: string) =>
    httpsCallable<RequestData, ResponseData>(FUNCTIONS, fnName)
