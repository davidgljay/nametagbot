const { WebClient } = require('@slack/client')

module.exports = new WebClient(process.env.SLACK_BOT_TOKEN)
module.exports.app = new WebClient(process.env.SLACK_APP_TOKEN)

module.exports.catchErr = msg => res => res.ok ? res : Promise.reject(new Error(msg, res.error))
