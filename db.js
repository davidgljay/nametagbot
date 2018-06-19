const MongoClient = require('mongodb').MongoClient
const url = `mongodb://${process.env.MDB_USER}:${process.env.MDB_PASS}@ds149960.mlab.com:49960/ntbot`
const dbName = process.env.MDB_NAME

module.exports = MongoClient.connect(url)
  .then(client => client.db(dbName))
