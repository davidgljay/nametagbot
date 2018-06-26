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
      case 'OPT_OUT':
        if (event.text === 'join') {
          return profile.update(db, user.id, {background: event.text, status: 'JOINER_BACKGROUND'})
            .then(() => slackapi.chat.postMessage({
              channel: event.channel.id,
              text: lang.profile.background()
            })
            )
        } else {
          return Promise.resolve()
        }
      case 'JOINER_BACKGROUND':
        console.log('joiner_bg')
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
                  author_icon: greeter.profile.image_48,
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
                callback_id: 'intro',
                text: `${greeter.background}\n\n${greeter.bio}`,
                thumb_url: greeter.profile.image_72,
                author_name: greeter.name,
                actions: [{
                  name: 'hi',
                  value: greeter.id,
                  text: 'Say hi',
                  type: 'button'
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
                  author_icon: greeter.profile.image_72,
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
          .then(() => slackapi.app.channels.join({name: 'greeters'}))
          .then(channel => slackapi.app.channels.invite({channel: channel.id, user: user.id}))
    }
  })
