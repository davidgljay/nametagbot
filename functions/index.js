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

  if (req.body.type === 'url_verification') {
    return events[req.body.type](req, res)
      .catch(err => console.error(err))
  } else if (req.body.type === 'event_callback') {
    res.setHeader('Content-Type', 'application/json')
    res.end()
    return events[req.body.event.type](req)
      .catch(err => console.error('Event: ', err))
  }
  res.sendStatus(400)
})

exports.register = functions.https.onRequest((req, res) => {
  if (req.method !== 'GET') {
    res.status(405)
    res.send('Only accepts GET Requests')
    res.end()
  }

  return events.register(req.query.code)
    .then(() => res.status(200).end())
    .catch(err => console.error('Register: ', err))
})
