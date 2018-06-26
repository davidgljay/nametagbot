 const appMention = require('../models/appMention')
const profile = require('../models/profile')
const slackapi = require('../slackapi')
const {shuffle} = require('../utils')
const lang = require('../lang')

module.exports = ({body: {event}}, db) => appMention.getByTs(db, event.item.ts)
  .then(mention => mention
    ? Promise.all([
      profile.get(db, event.user),
      profile.getGreeters(db)
    ])
      .then(([user, greeters]) => user
        ? Promise.resolve()
        : slackapi.users.info({user: event.user})
          .then(userInfo => profile.create(db, Object.assign({}, userInfo.user, {status: 'GREETER_BACKGROUND'})))
          .then(() => profile.openConvo(
            event.user,
            lang.profile.background(greeters.length > 0),
            greeters.length > 0
              ? shuffle(greeters).slice(0, 3)
                .map(greeter => ({
<<<<<<< HEAD
                  thumbnail: greeter.image,
=======
                  author_icon: greeter.profile.image_48,
>>>>>>> 1cb2c3dd71e0a663e510d09c84094c442b10b073
                  author_name: greeter.name,
                  text: greeter.background
                }))
              : []
          ))
      )
    : Promise.resolve()
  )
