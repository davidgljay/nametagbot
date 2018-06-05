const db = require('../db')

module.exports = {
  create: team => db.collection('teams').add(team),

  update: (id, prop, val) => db.collection('teams')
    .doc(id)
    .update({[prop]: val}),

  get: id => db.collection('teams').get(id)
}
