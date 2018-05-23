const functions = require('firebase-functions')
const db = require('./db')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   db.collection('test').doc('test').set({stuff: 'andthings'})
//   response.send('Hello from Firebase! Testnig data write')
// })

/*
* Function for handling Slack events
*/

exports.events = functions.https.onRequest((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'})
  switch(req.body.type) {
  case url_verification:
    res.send({challenge: req.body.challenge})
    break
  }
  //TODO: Parse by type
  //TODO: Call appropriate controller functions
})
