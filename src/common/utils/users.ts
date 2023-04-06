import { User } from 'firebase/auth'

import { UserCredential } from '@interfaces/user'

export function extractUserCredential(user: User): UserCredential | null {
    return {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        lastSignInTime: user.metadata.lastSignInTime,
    }
}
