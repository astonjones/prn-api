const { MongoClient } = require('mongodb');
const connectionString = process.env.CONNECTION_STRING;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let f_db;
let g_db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      //DBs are defined here
      f_db = db.db('facebook-data');
      g_db = db.db('google-data');
      console.log('Successfully connected to MongoDB.');

      return callback();
    });
  },

  getDb: function () {
    return {
        f_db: f_db,
        g_db: g_db
    };
  },
};