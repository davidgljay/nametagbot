const team = require('../models/team')

module.exports = (req, res) => team.create(
  Object.assign({}, req.body, {id: req.body.team_id})
)
