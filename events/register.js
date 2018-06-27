const team = require('../models/team')
const slackapi = require('../slackapi')
const profile = require('../models/profile')
const lang = require('../lang')
const {SLACK_CLIENT_ID, SLACK_CLIENT_SECRET} = process.env

module.exports = (req, db) => slackapi.oauth.access({code: req.query.code, client_id: SLACK_CLIENT_ID, client_secret: SLACK_CLIENT_SECRET})
  .then(teamInfo => {
    console.log(teamInfo)
    return team.create(Object.assign({}, teamInfo, {id: teamInfo.team_id, bot_access_token: teamInfo.bot.bot_access_token}))
  })
  .then(() => slackapi.users.list({token: req.body.token}))
  .then(users => Promise.all([
    users
      .filter(u => u.profile.is_admin)
      .map(u =>
        profile.create(db, Object.assign({}, u, {status: 'ADMIN_WELCOME'}))
          .then(() => profile.openConvo(
            u.id,
            lang.admin.welcome(),
            [{
              text: lang.admin.example()
            }]
          ))
      )
  ])
  )
