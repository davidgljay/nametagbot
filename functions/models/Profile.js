const db = require('../db')

module.exports = {
    create: profile => db.collection('profiles').set(profile),
    
    update: (id, prop, val) => db.collection('profiles')
      .doc(id)
      .update({[prop]: val}),
    
    find: id => db.collection('profiles').get(id)
}