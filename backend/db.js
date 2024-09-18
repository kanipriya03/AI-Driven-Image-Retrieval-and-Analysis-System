const { MongoClient } = require('mongodb');

let client;
let db;

async function getDatabase() {
  if (!client) {
    client = new MongoClient('mongodb://127.0.0.1:27017/');
    await client.connect();
    db = client.db('imageana');
    console.log("Connected to MongoDB");
  }
  return db;
}

module.exports = { getDatabase};


