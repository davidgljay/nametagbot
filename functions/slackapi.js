const { WebClient } = require('@slack/client')
const functions = require('firebase-functions')
const env = functions.config()

module.exports = new WebClient(env.slack.token)
