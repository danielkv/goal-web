import { FirebaseApp, initializeApp } from 'firebase/app'
import { ProviderId, connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'

type TEmulatorConfig = {
    host: string
    port: number
}

type TEmulators = 'auth' | 'functions'

type TFirebaseProviderOptions = {
    emulators?: Partial<Record<TEmulators, TEmulatorConfig>>
}

class FirebaseProvider {
    private app: FirebaseApp | null = null

    readonly signInOptions = [
        {
            provider: ProviderId.PASSWORD,
            fullLabel: 'Login',
            disableSignUp: { status: true },
        },
    ]

    constructor(readonly options?: TFirebaseProviderOptions) {}

    getApp() {
        if (this.app) return this.app

        try {
            this.app = initializeApp({
                apiKey: import.meta.env.VITE_APP_APIKEY,
                authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
                projectId: import.meta.env.VITE_APP_PROJECTID,
                storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
                messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
                appId: import.meta.env.VITE_APP_APPID,
                measurementId: import.meta.env.VITE_APP_MEASUREMENTID,
            })

            if (this.options?.emulators?.auth) {
                const auth = getAuth(this.app)
                const { host, port } = this.options.emulators.auth
                const url = `http://${host}:${port}`
                connectAuthEmulator(auth, url)
            }

            if (this.options?.emulators?.functions) {
                const functions = getFunctions(this.app)
                connectFunctionsEmulator(
                    functions,
                    this.options.emulators.functions.host,
                    this.options.emulators.functions.port
                )
            }

            return this.app
        } catch (err) {
            console.error('Ocorreu um erro ao inicialiar a conexão com o Banco de dados')
        }
    }

    getAuth() {
        const app = this.getApp()
        if (!app) throw new Error('Provedor de requisições não conectado')

        return getAuth(app)
    }

    getFunctions() {
        const app = this.getApp()
        if (!app) throw new Error('Provedor de requisições não conectado')

        return getFunctions(app)
    }

    FUNCTION_CALL<RequestData = unknown, ResponseData = unknown>(fnName: string) {
        const functions = this.getFunctions()
        if (!functions) throw new Error('Provedor de requisições não conectado')

        return httpsCallable<RequestData, ResponseData>(functions, fnName)
    }
    //
}

export const firebaseProvider = new FirebaseProvider(
    import.meta.env.DEV
        ? {
              emulators: {
                  functions: {
                      host: 'localhost',
                      port: 5001,
                  },
              },
          }
        : undefined
)
