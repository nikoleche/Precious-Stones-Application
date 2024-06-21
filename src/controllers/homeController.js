const { Router } = require("express");
const { getRecent, getAll, getById } = require("../services/stoneService");

const homeRouter = Router();

homeRouter.get("/", async (req, res) => {
  const stones = await getRecent();

  res.render("home", { stones });
});

homeRouter.get("/dashboard", async (req, res) => {
  const allStones = await getAll();
  res.render("dashboard", { allStones });
});

homeRouter.get("/dashboard/:id", async (req, res) => {
  const stone = await getById(req.params.id);

  if (!stone) {
    res.render("404");
    return;
  }

  const isOwner = req.user?._id === stone.owner.toString();
  const hasLiked = Boolean(
    stone.likedList.find((liked) => req.user?._id === liked.toString())
  );

  res.render("details", { stone, isOwner, hasLiked });
});

module.exports = { homeRouter };
