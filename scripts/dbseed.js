const admin = require('firebase-admin')
const data = require('./data.json')

// initialization
const projectId = 'goal-app-e4880'
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
admin.initializeApp({ projectId })

const db = admin.firestore()

// seed function
async function createSeedData() {
    try {
        await db.runTransaction(async (transaction) => {
            const worksheetRef = db.collection('worksheets')

            data.map((worksheet) => {
                const worksheetDocRef = worksheetRef.doc()

                transaction.create(worksheetDocRef, worksheet)

                const dayRef = worksheetDocRef.collection('days')

                worksheet.days.forEach((day) => {
                    const dayDocRef = dayRef.doc()
                    transaction.create(dayDocRef, day)
                })
            })
        })

        console.log('database seed was successful')
    } catch (error) {
        console.log(error, 'database seed failed')
    }
}

createSeedData()
