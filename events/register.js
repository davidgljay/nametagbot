const team = require('../models/team')
const slackapi = require('../slackapi')
const profile = require('../models/profile')
const lang = require('../lang')
const {SLACK_CLIENT_ID, SLACK_CLIENT_SECRET} = process.env

module.exports = (req, db) => slackapi.client.oauth.access({code: req.query.code, client_id: SLACK_CLIENT_ID, client_secret: SLACK_CLIENT_SECRET})
  .then(teamInfo => {
        const teamObj = Object.assign({}, teamInfo, {id: teamInfo.team_id, bot_access_token: teamInfo.bot.bot_access_token})
        team.create(db, teamObj)
          .then(() => slackapi.app(teamObj).users.list())
          .then(({members}) => Promise.all([
            members
              .filter(u => u.is_admin)
              .map(u =>
                profile.create(db, Object.assign({}, u, {status: 'ADMIN_WELCOME'}))
                  .then(() => profile.openConvo(
                    teamObj,
                    u.id,
                    lang.admin.welcome(),
                    [{
                      text: lang.admin.example()
                    }]
                  ))
              )
          ])
          )
  })
