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
          .then(() => postMessage(event.channel, lang.profile.bio()))
      case 'JOINER_BIO':
        return profile.update(db, user.id, {bio: event.text, status: 'JOINER_INTROS'})
          .then(() => profile.getGreeters())
          .then(greeters =>
            slackapi.chat.postMessage({
              channel: event.channel,
              text: lang.joiner.intros(),
              attachments:
              shuffle(greeters).slice(0, 3).map(greeter => ({
                channel_id: 'intro',
                text: greeter.bio,
                author_name: greeter.image,
                actions: [{
                  value: greeter.id,
                  text: 'Say hi'
                }]
              }))
            }))
      case 'GREETER_BACKGROUND':
        return profile.update(db, user.id, {background: event.text, status: 'GREETER_BIO'})
          .then(() => postMessage(event.channel, lang.profile.bio()))
      case 'GREETER_BIO':
        return profile.update(db, user.id, {bio: event.text, status: 'GREETER_READY'})
          .then(() => postMessage(event.channel, lang.greeter.thanks()))
    }
  })

const postMessage = (channel, text) => slackapi.chat.postMessage({
  as_user: false,
  channel,
  text
})
