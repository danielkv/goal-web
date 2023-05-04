import { getAuth } from 'firebase-admin/auth'
import { https } from 'firebase-functions'

import { init } from '../../helpers'
import { createHttpsError } from '../../utils/createHttpsError'

init()

interface UserData {
    displayName: string
    email: string
    password: string
}

export const createNewUser = https.onCall(async (data: UserData) => {
    const auth = getAuth()

    try {
        const newUser = await auth.createUser({ ...data, disabled: true })

        return {
            uid: newUser.uid,
            displayName: newUser.displayName,
            email: newUser.email,
        }
    } catch (err) {
        throw createHttpsError(err)
    }
})
