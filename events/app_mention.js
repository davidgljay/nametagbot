const appMention = require('../models/appMention')
const profile = require('../models/profile')
const team = require('../models/team')
const slackapi = require('../slackapi')
const lang = require('../lang')
const {shuffle} = require('../utils')

module.exports = ({body: {event, team_id}}, db) =>
  appMention.create(db, event)
  // Test to see if the mentioner has been added yet.
  // If not, add them and message them
    .then(() => Promise.all([
      profile.get(db, event.user),
      profile.getGreeters(db),
      team.get(db, team_id)
    ])
    )
    .then(([user, greeters, team]) => user && user.status !== 'ADMIN_WELCOME'
      ? Promise.resolve()
      : slackapi.bot(team).users.info({user: event.user})
        .then(userInfo => profile.create(db, Object.assign({}, userInfo.user, {status: 'GREETER_BACKGROUND'})))
        .then(() => profile.openConvo(team,
          event.user,
          lang.profile.background(greeters.length > 0),
          greeters.length > 0
            ? shuffle(greeters).slice(0, 3)
              .map(greeter => ({
                author_icon: greeter.profile.image_48,
                author_name: greeter.name,
                text: greeter.background
              }))
            : []
        ))
    )
