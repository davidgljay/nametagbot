const { WebClient } = require('@slack/client')
const env = firebase.config()
const profile = require('../models/profile')
const lang = require('../lang')

const web = new WebClient(env.slack.token)

module.exports = ({body: {event: {user}}}) => 
  profile.create(user)
  .then(() => web.channels.open(user.id))
  .then(res => {
    if (!res.ok) {
      console.error('Failed to save user', res.error)
      return
    }
    
    return web.chat.postMessage({
          as_user: true,
          channel: res.channel.id,
          text: lang.welcome()
      })
  } )