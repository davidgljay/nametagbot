const express = require('express')
const app = express()
const events = require('./events')
const actions = require('./actions')
const bodyParser = require('body-parser')
const dbInit = require('./db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

dbInit.then(db => {
  app.post('/events', (req, res) => {
    if (req.body.token !== process.env.SLACK_TOKEN) {
      console.error('Incorrect Slack token received with request', req.body)
      res.status(403)
      res.send('Not Authorized')
      res.end()
      return
    }

    if (req.body.type === 'url_verification') {
      return events[req.body.type](req, res, db)
    } else if (req.body.type === 'event_callback') {
      res.end()
      // For testing purposes, trigger events from messages
      if (req.body.event.type === 'message' && events[req.body.event.text]) {
        console.log('manually triggered event', req.body.event.text)
        return events[req.body.event.text]({body: {event: {user: {id: req.body.event.user}}}}, db)
          .catch(err => console.error('Event: ', err))
      }
      return events[req.body.event.type](req, db)
        .catch(err => console.error('Event: ', err))
    }
    res.sendStatus(400)
  })

  app.post('/actions', (req, res) => {
    const payload = JSON.parse(req.body.payload)
    if (payload.token !== process.env.SLACK_TOKEN) {
      console.error('Incorrect Slack token received with request', payload)
      res.status(403)
      res.send('Not Authorized')
      res.end()
      return
    }
    res.status(200).end()
    console.log(`${payload.callback_id}_${payload.actions[0].name}`)
    return actions[`${payload.callback_id}_${payload.actions[0].name}`](payload, db)
  })

  app.get('/register', (req, res) => {
    return events.register(req.query.code)
      .then(() => res.status(200).end())
      .catch(err => console.error('Register: ', err))
  })
})

app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + process.env.PORT)
})
