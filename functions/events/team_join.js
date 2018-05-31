const profile = require('../models/profile')
const lang = require('../lang')

module.exports = ({body: {token, event: {user}}}) =>
  profile.create(user)
    .then(() => profile.openConvo(token, user.id, lang.newMember.welcome()))
