module.exports = {
  create: (db, appMention) => db.collection('app_mentions').insert(appMention),

  get: (db, id) => db.collection('app_mentions').findOne({'_id': id}),

  getByTs: (db, ts) => db.collection('app_mentions').findOne({ts})
}
