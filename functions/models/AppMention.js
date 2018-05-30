const db = require('../db')

module.exports = {
  create: appMention => db.collection('app_mentions').add(appMention),

  get: id => db.collection('app_mentions').get(id),

  getByTs: ts => db.collection('app_mentions').where('ts', '==', ts)
}
