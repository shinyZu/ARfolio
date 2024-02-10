require("dotenv").config();
const mongoose = require("mongoose");

// Database URL to connect with
const url = process.env.URL;

// Create MongoDB Connection
const establishConnection = mongoose.connect(url, {
  useNewUrlParser: true,
});

const conn = mongoose.connection;

// runs everytime when connected to mongodb
conn.on("open", () => {
  console.log("Connected to MongoDB...!");
});

module.exports = {
  connection: establishConnection,
  conn: conn,
};