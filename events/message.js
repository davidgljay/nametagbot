const profile = require('../models/profile')
const slackapi = require('../slackapi')
const lang = require('../lang')
const {shuffle} = require('../utils')

module.exports = ({body: {event}}, db) => profile.get(db, event.user)
  .then(user => {
    if (!user) {
      return Promise.resolve()
    }
    switch (user.status) {
      case 'JOINER_BACKGROUND':
        return profile.update(db, user.id, {background: event.text, status: 'JOINER_BIO'})
          .then(() => profile.getGreeters(db))
          .then((greeters) =>
            slackapi.chat.postMessage({
              channel: event.channel,
              text: lang.profile.bio(greeters.length > 0),
              attachments:
                shuffle(greeters).slice(0, 3).map(greeter => ({
                  channel_id: 'intro',
                  text: greeter.bio,
                  thumbnail: greeter.image,
                  author_name: greeter.name
                }))
            })
          )
      case 'JOINER_BIO':
        return profile.update(db, user.id, {bio: event.text, status: 'JOINER_INTROS'})
          .then(() => profile.getGreeters(db))
          .then((greeters = []) =>
            slackapi.chat.postMessage({
              channel: event.channel,
              text: lang.joiner.intros(),
              attachments:
              shuffle(greeters).slice(0, 3).map(greeter => ({
                channel_id: 'intro',
                text: greeter.bio,
                thumbnail: greeter.image,
                author_name: greeter.name,
                actions: [{
                  value: greeter.id,
                  text: 'Say hi'
                }]
              }))
            })
          )
      case 'GREETER_BACKGROUND':
        return profile.update(db, user.id, {background: event.text, status: 'GREETER_BIO'})
          .then(() => profile.getGreeters(db))
          .then((greeters) =>
            slackapi.chat.postMessage({
              channel: event.channel,
              text: lang.profile.bio(greeters.length > 0),
              attachments:
                shuffle(greeters).slice(0, 3).map(greeter => ({
                  channel_id: 'intro',
                  text: greeter.bio,
                  thumbnail: greeter.image,
                  author_name: greeter.name
                }))
            })
          )
      case 'GREETER_BIO':
        return profile.update(db, user.id, {bio: event.text, status: 'GREETER_READY'})
          .then(() => slackapi.chat.postMessage({
            channel: event.channel,
            text: lang.greeter.thanks()
          }))
          .then(() => slackapi.app.channels.create({name: 'greeters', validate: true}))
          .then(channel => slackapi.app.channels.invite({channel: channel.id, user: user.id}))
    }
  })
