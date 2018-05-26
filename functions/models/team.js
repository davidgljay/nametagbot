const db = require('../db')

module.exports = {
    create: profile => db.collection('teams').set(profile),
    
    update: (id, prop, val) => db.collection('teams')
      .doc(id)
      .update({[prop]: val}),
    
    get: id => db.collection('teams').get(id)
}