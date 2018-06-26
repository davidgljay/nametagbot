const profile = require('../models/profile')
const lang = require('../lang')

module.exports = ({body: {event: {user}}}, db) =>
  profile.create(db, Object.assign({}, user, {status: 'JOINER_BACKGROUND'}))
    .then(() => profile.getGreeters(db))
    .then((greeters) => greeters.length > 0
      ? profile.openConvo(
        user.id,
        lang.joiner.welcome('DJ Bot Test'),
        [{
          text: 'Sound good?',
          attachment_type: 'default',
          callback_id: 'optin',
          actions: [
            {
              name: 'yes',
              text: 'Sure!',
              type: 'button'
            },
            {
              name: 'no',
              text: 'No thanks.',
              type: 'button'
            }
          ]
        }]
      )
      : Promise.resolve()
    )
