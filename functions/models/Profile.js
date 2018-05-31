const db = require('../db')
const slackapi = require('../slackapi')

module.exports = {
  create: profile => db.collection('profiles').add(profile),

  update: (id, prop, val) => db.collection('profiles')
    .doc(id)
    .update({[prop]: val}),

  get: id => db.collection('profiles').get(id),

  openConvo: (token, userId, text) =>
    slackapi.conversations.open({token, users: userId})
      .then(slackapi.catchErr('Error opening conversation'))
      .then(conversation => slackapi.chat.postMessage({
        token,
        as_user: false,
        channel: conversation.channel.id,
        text
      }))
}
