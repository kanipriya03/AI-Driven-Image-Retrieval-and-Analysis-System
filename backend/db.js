

// db.js
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


// const { MongoClient } = require('mongodb');

// const uri = "mongodb://127.0.0.1:27017/"; // Replace with your MongoDB connection string
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// let db = null;

// async function connectDB() {
//     if (db) return db; // Return the existing connection if already connected
//     try {
//         await client.connect();
//         db = client.db('imageana');
//         console.log("Connected to MongoDB");
//         return db;
//     } catch (err) {
//         console.error("Failed to connect to MongoDB", err);
//         throw err;
//     }
// }

// module.exports = { connectDB };