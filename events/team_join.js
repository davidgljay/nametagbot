const profile = require('../models/profile')
const lang = require('../lang')

module.exports = ({body: {event: {user}}}) =>
  profile.create(user)
    .then(() => profile.openConvo(user.id, lang.newMember.welcome()))
