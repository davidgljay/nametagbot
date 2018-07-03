const profile = require('../models/profile')
const team = require('../models/team')
const lang = require('../lang')

module.exports = ({body: {team_id, event: {user}}}, db) =>
  profile.create(db, Object.assign({}, user, {status: 'JOINER_BACKGROUND'}))
    .then(() => Promise.all([
      profile.getGreeters(db),
      team.get(db, team_id)
    ]))
    .then(([greeters, team])=> greeters.length > 0
      ? profile.openConvo(
        team,
        user.id,
        lang.joiner.welcome('DJ Bot Test'),
        [{
          text: 'Sound good?',
          attachment_type: 'default',
          callback_id: 'optin',
          actions: [
            {
              name: 'yes',
              text: 'Sure!',
              type: 'button'
            },
            {
              name: 'no',
              text: 'No thanks.',
              type: 'button'
            }
          ]
        }]
      )
      : Promise.resolve()
    )
