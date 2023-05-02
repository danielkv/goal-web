import { getAuth } from 'firebase-admin/auth'
import { https } from 'firebase-functions'

import { init } from '../../helpers'

init()

interface ValidationResponse {
    uid: string
    email?: string
}

export const createSessionCookie = https.onCall(async (data: string) => {
    await getAuth().verifyIdToken(data)

    const expiresIn = 60 * 60 * 24 * 5 * 1000
    const sessionCookie = await getAuth().createSessionCookie(data, { expiresIn })

    const result = {
        sessionCookie,
    }

    return result
})

export const validateSessionCookie = https.onCall(async (data: string) => {
    const decoded = await getAuth().verifySessionCookie(data, true)

    const result: ValidationResponse = {
        uid: decoded.uid,
        email: decoded.email,
    }

    return result
})
