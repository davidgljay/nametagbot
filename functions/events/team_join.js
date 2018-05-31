const web = require('../slackapi')
const profile = require('../models/profile')
const lang = require('../lang')

module.exports = ({body: {token, event: {user}}}) =>
  profile.create(user)
    .then(() => web.conversations.open({token, users: user.id}))
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(new Error('Failed to open channel', res.error))
      }

      return web.chat.postMessage({
        as_user: false,
        channel: res.channel.id,
        text: lang.newMember.welcome()
      })
    })
