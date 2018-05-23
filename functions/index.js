const functions = require('firebase-functions')
const db = require('./db')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  db.collection('test').doc('test').set({stuff: 'andthings'})
  response.send('Hello from Firebase! Testnig data write')
})
