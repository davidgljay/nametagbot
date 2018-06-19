const appMention = require('../models/appMention')
const profile = require('../models/profile')
const slackapi = require('../slackapi')
const lang = require('../lang')

module.exports = ({body: {event}}, db) => appMention.getByTs(db, event.item.ts)
  .then(mention => mention
    ? profile.get(db, event.user)
      .then(user => user
        ? Promise.resolve()
        : slackapi.users.info({user: event.user})
          .then(userInfo => profile.create(db, {...userInfo.user, greeter: true}))
          .then(() => profile.openConvo(event.user, lang.profile.background()))
      )
    : Promise.resolve()
  )
