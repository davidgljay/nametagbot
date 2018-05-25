const functions = require('firebase-functions')
const runtimeConfig = require('cloud-functions-runtime-config')
const env = runtimeConfig.getVariable('slack_token')
const events = require('./events')

/*
* Function for handling Slack events
*/

exports.events = functions.https.onRequest((req, res) => env.then(env => {
  
  if (req.body.token !== env.slack_token || req.status !== 'POST') {
    console.error('Incorrect Slack token received with request')
    res.status(403).send('Not Authorized')
    return
  }
  
  res.writeHead(200, {'Content-Type': 'application/json'})

  if (req.body.type === 'url_verification') {
    events.urlVerification(req, res)
  }

  // TODO: Call appropriate controller functions
}))
