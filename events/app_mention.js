const appMention = require('../models/appMention')
const profile = require('../models/profile')
const slackapi = require('../slackapi')
const lang = require('../lang')
const {shuffle} = require('../utils')

module.exports = ({body: {event}}, _, db) =>
  appMention.create(db, event)
  // Test to see if the mentioner has been added yet.
  // If not, add them and message them
    .then(() => Promise.all([
        profile.get(db, event.user),
        profile.getGreeters()
      ])
    )
    .then(([user, greeters]) => user
      ? Promise.resolve()
      : slackapi.users.info({user: event.user})
        .then(userInfo => profile.create(db, {...userInfo.user, status: 'GREETER_BACKROUND'}))
        .then(() => profile.openConvo(
          event.user,
          lang.profile.background(),
          greeters.length > 0
            ? shuffle(greeters).slice(0,3)
                .map(greeter => ({
                  thumbnail: greeter.image,
                  author_name: greeter.name,
                  text: greeter.background
                }))
            : []
        ))
    )
