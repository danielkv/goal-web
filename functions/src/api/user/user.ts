import { getAuth } from 'firebase-admin/auth'
import { https } from 'firebase-functions'

import { init } from '../../helpers'

init()

interface UserData {
    displayName: string
    email: string
    password: string
}

export const createNewUser = https.onCall(async (data: UserData) => {
    const auth = getAuth()

    const newUser = await auth.createUser({ ...data, disabled: true })

    return {
        uid: newUser.uid,
        displayName: newUser.displayName,
        email: newUser.email,
    }
})
