const db = require('../db')

module.exports = {
  create: profile => db.collection('profiles').add(profile),

  update: (id, prop, val) => db.collection('profiles')
    .doc(id)
    .update({[prop]: val}),

  get: id => db.collection('profiles').get(id)
}
