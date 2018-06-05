const admin = require('firebase-admin')

admin.initializeApp(process.env.FIRESTORE_KEY)

module.exports = admin.firestore()
