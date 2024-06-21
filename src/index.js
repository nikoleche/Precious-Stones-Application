const express = require("express");
const { configDatabase } = require("./config/configDatabase");
const { configExpress } = require("./config/configExpress");
const { configHbs } = require("./config/configHbs");
const { configRoutes } = require("./config/configRoutes");
const { register, login } = require("./services/userService");
const { generateToken, verifyToken } = require("./services/jwt");

start();

async function start() {
  const app = express();

  await configDatabase();
  configHbs(app);
  configExpress(app);
  configRoutes(app);

  app.listen(3000, () => {
    console.log("Server started successfully");
  });
}
