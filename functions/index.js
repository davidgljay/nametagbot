const functions = require('firebase-functions')
const runtimeConfig = require('cloud-functions-runtime-config')
const env = runtimeConfig.getVariable('slack_token')

/*
* Function for handling Slack events
*/

exports.events = functions.https.onRequest((req, res) => env.then(env => {
  res.writeHead(200, {'Content-Type': 'application/json'})

  if (req.body.token !== env.slack_token) {
    console.error('Incorrect Slack token received with request')
    res.end()
    return
  }

  switch (req.body.type) {
    case 'url_verification':
      res.send({challenge: req.body.challenge})
      break
  }
  // TODO: Call appropriate controller functions
}))
