const slackapi = require('../slackapi')
const lang = require('../lang')
const profile = require('../models/profile')
const team = require('../models/team')

module.exports = (req, db) => profile.update(db, req.user, {state: 'OPT_OUT'})
  .then(() => team.get(db, req.body.team_id))
  .then(team => slackapi.bot(team).chat.postMessage({
    channel: req.channel.id,
    text: lang.joiner.nothanks()
  })
  )
