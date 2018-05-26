const { WebClient } = require('@slack/client')
const env = firebase.config()
const profile = require('../models/profile')
const team = require('../models/team')
const lang = require('../lang')

const web = new WebClient(env.slack.token)

module.exports = ({body: {event: {user}}}) => 
  profile.create(user)
  .then(team.get(user.team))
  .then(() => web.channels.open(user.id))
  .then(res => {
    if (!res.ok) {
      return Promise.reject('Failed to open channel', res.error)
    }
    
    return web.chat.postMessage({
          as_user: true,
          channel: res.channel.id,
          text: lang.welcome()
      })
  } )