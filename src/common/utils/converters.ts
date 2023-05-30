import cloneDeep from 'clone-deep'
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
        const day = pick(model, ['date', 'name', 'periods'])
        day.periods = cloneDeep(day.periods)

        return day
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
        const result = pick(model, ['info', 'name', 'published', 'startDate', 'startEndDate'])

        return result
    },
}
