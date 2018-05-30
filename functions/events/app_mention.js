const appMention = require('../models/AppMention')

module.exports = (req, res) => appMention.create(Object.assign({}, req.body))
