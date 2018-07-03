const slackapi = require('../slackapi')
const lang = require('../lang')
const profile = require('../models/profile')
const team = require('../models/team')

module.exports = (req, db) =>
  Promise.all([
    team.get(db, req.team.id),
    profile.update(db, req.user.id, {status: 'JOINER_INTROED'}),
    profile.push(db, req.actions[0].value, {mentees: req.user.id})
  ])
  .then(([team]) => Promise.all([
    slackapi.bot(team).conversations.open({users: `${req.actions[0].value}, ${req.user.id}`}),
    profile.get(db, req.actions[0].value),
    profile.get(db, req.user.id),
    team
  ])
  )
  .then(([conversation, greeter, joiner, team]) =>
    slackapi.bot(team).chat.postMessage({
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
    .then(() => slackapi(team).chat.postMessage({
      channel: req.channel.id,
      text: lang.joiner.connected()
    })
    )
  )
