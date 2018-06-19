const appMention = require('../models/appMention')
const profile = require('../models/profile')
const slackapi = require('../slackapi')
const lang = require('../lang')

module.exports = ({body: {event}}, _, db) =>
  appMention.create(db, event)
  // Test to see if the mentioner has been added yet.
  // If not, add them and message them
    .then(() => profile.get(db, event.user))
    .then(user => user
      ? Promise.resolve()
      : slackapi.users.info({user: event.user})
        .then(slackapi.catchErr('Error getting user info'))
        .then(userInfo => profile.create(db, {...userInfo.user, greeter: true}))
        .then(() => profile.openConvo(event.user, lang.profile.background()))
    )
