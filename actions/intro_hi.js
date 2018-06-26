const slackapi = require('../slackapi')
const lang = require('../lang')
const profile = require('../models/profile')

module.exports = (req, db) =>
Promise.all([
  profile.update(db, req.user.id, {status: 'JOINER_INTROED'}),
  profile.push(db, req.actions[0].value, {mentees: req.user.id})
])
.then(() => Promise.all([
  slackapi.conversations.open({users: `${req.actions[0].value}, ${req.user.id}`}),
  profile.get(db, req.actions[0].value),
  profile.get(db, req.user.id)
])
)
.then(([conversation, greeter, joiner]) =>
  slackapi.chat.postMessage({
    channel: conversation.channel.id,
    text: lang.intro.welcome(joiner.name, greeter.name),
    attachments: [
      {
        author_name: greeter.name,
        thumb_url: greeter.profile.image_48,
        text: greeter.background
      },
      {
        author_name: joiner.name,
        thumb_url: joiner.profile.image_48,
        text: joiner.background
      }
    ]
  })
)
.then(() => slackapi.chat.postMessage({
  channel: req.channel.id,
  text: lang.joiner.connected()
  })
)
