import { createSignal } from 'solid-js'

import { FIREBASE_AUTH } from '@common/providers/firebase'

let isSet = false

interface UserCredential {
    id: string
    email: string
    displayName?: string
    lastSignInTime: string
}

const [loggedUserAc, setLoggedUser] = createSignal<UserCredential | null>(null)

export function setupFbAuthListener() {
    if (isSet) return

    FIREBASE_AUTH.onAuthStateChanged((user) => {
        if (!user) setLoggedUser(null)
        else
            setLoggedUser({
                id: user.uid,
                email: user.email,
                displayName: user.displayName,
                lastSignInTime: user.metadata.lastSignInTime,
            } as UserCredential)
    })

    isSet = true
}

export const loggedUser = loggedUserAc
