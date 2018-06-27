const slackapi = require('../slackapi')

module.exports = {
  create: (db, profile) => db.collection('profiles').insert(profile),

  update: (db, id, update) => db.collection('profiles')
    .updateOne({id}, {'$set': update}),

  push: (db, id, update) => db.collection('profiles')
    .updateOne({id}, {'$push': update}),

  get: (db, id) => db.collection('profiles').findOne({id}),

  getGreeters: (db) => db.collection('profiles').find({
    'bio': { $exists: true, $ne: null },
    'background': { $exists: true, $ne: null },
    'status': 'GREETER_READY'
  }).toArray(),

  openConvo: (userId, text, attachments) => {
    return slackapi.conversations.open({users: userId})
      .then(slackapi.catchErr('Error opening conversation'))
      .then(conversation => slackapi.chat.postMessage({
        as_user: false,
        channel: conversation.channel.id,
        text,
        attachments
      }))
  }
}
