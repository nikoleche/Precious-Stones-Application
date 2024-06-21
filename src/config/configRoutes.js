const { homeRouter } = require("../controllers/homeController");
const { stoneRouter } = require("../controllers/stoneController");
const { userRouter } = require("../controllers/userController");

function configRoutes(app) {
  app.use(homeRouter);
  app.use(userRouter);
  app.use(stoneRouter);
}

module.exports = { configRoutes };
