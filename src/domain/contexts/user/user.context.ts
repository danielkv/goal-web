import { createSignal } from 'solid-js'

import { FIREBASE_AUTH } from '@common/providers/firebase'
import { UserCredential } from '@interfaces/user'
import { extractUserCredential } from '@utils/users'

let isSet = false

export const [loggedUser, setLoggedUser] = createSignal<UserCredential | null>(null)

export function setupFbAuthListener() {
    if (isSet) return

    FIREBASE_AUTH.onAuthStateChanged((user) => {
        if (!user) setLoggedUser(null)
        else setLoggedUser(extractUserCredential(user))
    })

    isSet = true
}
