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
    try {
        const auth = getAuth()

        const userData = {
            ...data,
            disabled: true,
            subscription: {
                name: 'free',
                active: true,
            },
        }
        const newUser = await auth.createUser(userData)

        return {
            uid: newUser.uid,
            displayName: newUser.displayName,
            email: newUser.email,
        }
    } catch (err) {
        throw createHttpsError(err)
    }
})

export const updateSubscription = https.onCall(async (data: UserData) => {
    try {
        const auth = getAuth()

        const userData = {
            ...data,
            disabled: true,
            subscription: {
                name: 'free',
                active: true,
            },
        }
        const newUser = await auth.createUser(userData)

        return {
            uid: newUser.uid,
            displayName: newUser.displayName,
            email: newUser.email,
        }
    } catch (err) {
        throw createHttpsError(err)
    }
})
