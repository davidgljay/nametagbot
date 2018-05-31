const appMention = require('../models/appMention')
const profile = require('../models/profile')
const slackapi = require('../slackapi')
const lang = require('../lang')

module.exports = ({body: {token, event}}) => appMention.create(event)
  // Test to see if the mentioner has been added yet.
  // If not, add them and message them
  .then(() => profile.get(event.user))
  .then(user => user
    ? Promise.resolve()
    : slackapi.users.info({token, user: event.user})
      .then(slackapi.catchErr('Error getting user info'))
      .then(userInfo => profile.create(userInfo.user))
      .then(() => slackapi.conversations.open({token, users: event.user}))
      .then(slackapi.catchErr('Error opening conversation'))
      .then(conversation => slackapi.chat.postMessage({
        token,
        as_user: false,
        channel: conversation.channel.id,
        text: lang.greeter.thanks()
      }))
  )
