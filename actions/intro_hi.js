const slackapi = require('../slackapi')
const lang = require('../lang')
const profile = require('../models/profile')

module.exports = (req, db) => Promise.all([
  profile.update(req.user, {status: 'JOINER_INTROED'}),
  profile.push(req.value, {mentees: req.user})
])
  .then(() => Promise.all([
    slackapi.conversations.open({users: [req.value, req.user]}),
    profile.get(req.value),
    profile.get(req.user)
  ])
  )
  .then(([conversation, greeter, joiner]) => slackapi.chat.postMessage({
    channel: conversation.channel.id,
    text: lang.intro.welcome(),
    attachments: [
      {
        author_name: greeter.name,
        thumbnail_image: greeter.image,
        text: greeter.background
      },
      {
        author_name: joiner.name,
        thumbnail_image: joiner.image,
        text: joiner.background
      }
    ]})
  )
