const slackapi = require('../slackapi')
const lang = require('../lang')
const profile = require('../models/profile')
const team = require('../models/team')
const {shuffle} = require('../utils')

module.exports = (req, db) => profile.update(db, req.user, {state: 'JOINER_BACKGROUND'})
  .then(() => Promise.all([
      profile.getGreeters(db),
      team.get(db, req.body.team_id)
    ])
  )
  .then(([greeters, team]) => slackapi.bot(team).chat.postMessage({
    channel: req.channel.id,
    text: lang.profile.background(greeters.length > 0),
    attachments: greeters.length > 0
      ? shuffle(greeters).slice(0, 3)
        .map(greeter => ({
          author_icon: greeter.profile.image_48,
          author_name: greeter.name,
          text: greeter.background
        }))
      : []
  })
  )
