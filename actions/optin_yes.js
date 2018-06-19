const slackapi = require('../slackapi')
const lang = require('../lang')
const profile = require('../models/profile')

module.exports = (req, db) => profile.update(db, req.user, 'state', 'JOINER_BACKGROUND')
  .then(() => slackapi.chat.postMessage({
    channel: req.channel.id,
    text: lang.profile.background()
  })
  )
