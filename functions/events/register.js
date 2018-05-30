const team = require('../models/team')
const web = require('../slackapi')
const profile = require('../models/profile')
const lang = require('../lang')

const getmembers = token => response => {
  if (!response.ok) {
    return Promise.reject(new Error('Failed to return list of users.', response.error))
  }
  const promises = []
  promises.concat(
    response.members.map(member =>
      profile.add(member)
        .then(() => web.conversations.open(member.id))
        .then(conversation => conversation.ok ? conversation : Promise.reject(new Error('Failed to open conversation', conversation.error)))
        .then(conversation => web.chat.postMessage({
          token,
          channel: conversation.channel.id,
          text: lang.welcome()
        }))
    )
  )

  // Get more members if they exist
  if (response.response_metadata && response.response_metadata.nextcursor) {
    promises.push(
      web.users.list({token: token, cursor: response.response_metadata.nextcursor})
        .then(getmembers(token))
    )
  }

  // Add some throtling to not overwhelm Slack's API.
  // In the future this could be more elegantly handled using a pubsub.
  let chainedPromise = Promise.resolve
  for (var i = 0; i < promises.length; i++) {
    chainedPromise.then(() =>
      new Promise(resolve => setTimeout(() => promises[i].then(resolve), 500))
    )
  }

  return chainedPromise
}

module.exports = (req, res) => team.create(Object.assign({}, req.body, {id: req.body.team_id}))
  .then(() => web.users.list({token: req.body.token}))
  .then(getmembers(req.body.token))
