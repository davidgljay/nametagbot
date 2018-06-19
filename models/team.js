module.exports = {
  create: (db, team) => db.collection('teams').insert(team),

  update: (db, id, prop, val) => db.collection('teams')
    .updateOne({id}, {'$set': {[prop]: val}}),

  get: (db, id) => db.collection('teams').findOne({id})
}
