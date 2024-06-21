const mongoose = require("mongoose");
require("../models/User");
require("../models/Stone");

async function configDatabase() {
  const connectionString = "mongodb://localhost:27017/earth-treasure";

  await mongoose.connect(connectionString);

  console.log("Database linked successfully");
}

module.exports = { configDatabase };
