import { initializeApp } from 'firebase-admin'
import { getApps } from 'firebase-admin/app'

export function init() {
    if (!getApps().length) initializeApp()
}
