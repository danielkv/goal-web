import { FirestoreDataConverter } from 'firebase/firestore'
import { pick } from 'radash'

import { IDayModel, IWorksheetModel } from '@models/day'

export const dayConverter: FirestoreDataConverter<IDayModel> = {
    fromFirestore(snapshot) {
        return {
            ...(snapshot.data() as IDayModel),
            id: snapshot.id,
        }
    },
    toFirestore(model) {
        return pick(model, ['date', 'name', 'periods'])
    },
}

export const worksheetConverter: FirestoreDataConverter<Omit<IWorksheetModel, 'days' | 'isCurrent'>> = {
    fromFirestore(snapshot) {
        return {
            ...(snapshot.data() as IWorksheetModel),
            id: snapshot.id,
        }
    },
    toFirestore(model) {
        return pick(model, ['info', 'name', 'published', 'startDate', 'startEndDate'])
    },
}
