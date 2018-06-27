const slackapi = require('../slackapi')
const lang = require('../lang')
const profile = require('../models/profile')

module.exports = (req, db) => profile.update(db, req.user, {state: 'OPT_OUT'})
  .then(() => slackapi.chat.postMessage({
    channel: req.channel.id,
    text: lang.joiner.nothanks()
  })
  )
