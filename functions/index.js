const functions = require('firebase-functions')
const env = functions.config()
const events = require('./events')

/*
* Function for handling Slack events
*/

exports.events = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST' || req.body.token !== env.slack.token) {
    console.error('Incorrect Slack token received with request', req.body.token)
    res.status(403)
    res.send('Not Authorized')
    res.end()
    return
  }

  res.setHeader('Content-Type','application/json')

  if (req.body.type === 'url_verification') {
    events[req.body.type](req, res)
  } else if (req.body.type === 'event_callback') {
    events[req.body.event.type](req, res)
  }
  
  

  res.end()

  // TODO: Call appropriate controller functions
})
