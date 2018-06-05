const appMention = require('../models/appMention')
const profile = require('../models/profile')
const slackapi = require('../slackapi')
const lang = require('../lang')

module.exports = ({body: {token, event}}) => appMention.getByTs(event.item.ts)
  .then(mention => mention
    ? profile.get(event.user)
      .then(user => user
        ? Promise.resolve()
        : slackapi.users.info({token, user: event.user})
          .then(slackapi.catchErr('Error getting user info'))
          .then(userInfo => profile.create(userInfo.user))
          .then(() => profile.openConvo(token, event.user, lang.greeter.thanks()))
      )
    : Promise.resolve()
  )
