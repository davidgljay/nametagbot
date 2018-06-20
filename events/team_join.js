const profile = require('../models/profile')
const lang = require('../lang')

module.exports = ({body: {event: {user}}}, db) =>
  profile.create(db, Object.assign({}, user, {status: 'JOINER_BACKGROUND'}))
    .then(() => profile.openConvo(
      user.id,
      lang.joiner.welcome('DJ Bot Test'),
      [{
        text: 'Sound good?',
        attachment_type: 'default',
        callback_id: 'optin',
        actions: [
          {
            name: 'optin',
            text: 'Sure!',
            type: 'button',
            value: 'yes'
          },
          {
            name: 'optin',
            text: 'No thanks.',
            type: 'button',
            value: 'no'
          }
        ]
      }]
    ))
