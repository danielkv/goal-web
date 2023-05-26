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
        const newUser = await auth.createUser({ ...data, disabled: false, emailVerified: false })

        return newUser
    } catch (err) {
        throw createHttpsError(err)
    }
})

export const removeUser = https.onCall(async (uuid: string) => {
    const auth = getAuth()

    try {
        await auth.deleteUser(uuid)
    } catch (err) {
        throw createHttpsError(err)
    }
})
