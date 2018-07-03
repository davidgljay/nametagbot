const { WebClient } = require('@slack/client')

module.exports.bot = team => new WebClient(team.bot_access_token)
module.exports.app = team => new WebClient(team.access_token)
module.exports.client = new WebClient()

module.exports.catchErr = msg => res => res.ok ? res : Promise.reject(new Error(msg, res.error))
