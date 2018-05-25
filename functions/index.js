const functions = require('firebase-functions')
const env = functions.config()
const events = require('./events')

/*
* Function for handling Slack events
*/

exports.events = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST' || req.body.token !== env.bot.slack_token) {
    console.log(req.method)
    console.error('Incorrect Slack token received with request', env, req.body)
    console.log(req.body.token, env.bot.slack_token, env.bot.slack_token === req.body.token)
    res.status(403)
    res.send('Not Authorized')
    res.end()
    return
  }

  res.writeHead(200, {'Content-Type': 'application/json'})

  if (req.body.type === 'url_verification') {
    events.urlVerification(req, res)
  }

  res.end()

  // TODO: Call appropriate controller functions
})
