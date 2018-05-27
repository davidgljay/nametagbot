const team = require('../models/team')
const web = require('../slackapi')

module.exports = (req, res) => team.create(Object.assign({}, req.body, {id: req.body.team_id}))
  .then(() => web.users.list({token: req.body.token}))
