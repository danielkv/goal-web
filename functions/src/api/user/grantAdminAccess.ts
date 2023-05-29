import { getAuth } from 'firebase-admin/auth'
import { https } from 'firebase-functions'

import { init } from '../../helpers'

init()

export const grantAdminAccess = https.onCall((uid: string, context) => {
    if (context.auth?.token.email != 'danielkv@gmail.com') throw new Error('Forbiden')

    return getAuth().setCustomUserClaims(uid, { admin: true })
})
