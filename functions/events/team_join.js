const { WebClient } = require('@slack/client')
const functions = require('firebase-functions')
const env = functions.config()
const profile = require('../models/profile')
const lang = require('../lang')

const web = new WebClient(env.slack.token)

module.exports = ({body: {event: {user}}}) =>
  profile.create(user)
    .then(() => web.channels.open(user.id))
    .then(([team, res]) => {
      if (!res.ok) {
        return Promise.reject(new Error('Failed to open channel', res.error))
      }

      return web.chat.postMessage({
        as_user: false,
        channel: res.channel.id,
        text: lang.welcome()
      })
    })
