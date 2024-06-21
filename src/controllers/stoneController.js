const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { parseError } = require("../util");
const { isUser } = require("../middlewares/guards");
const {
  create,
  getById,
  update,
  deleteById,
  like,
} = require("../services/stoneService");

const stoneRouter = Router();

stoneRouter.get("/create", isUser(), async (req, res) => {
  res.render("create");
});
stoneRouter.post(
  "/create",
  isUser(),
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 symbols long"),
  body("category")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 symbols long"),
  body("color")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Color must be at least 2 symbols long"),
  body("image")
    .trim()
    .isURL({ require_tld: false })
    .withMessage("Image must start with http:// or https://"),
  body("location")
    .trim()
    .isLength({ min: 5, max: 15 })
    .withMessage("Location must be between 5 and 15 symbols long"),
  body("formula")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Formula must be between 5 and 15 symbols long"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 symbols long"),

  async (req, res) => {
    try {
      const validation = validationResult(req);

      if (validation.errors.length) {
        throw validation.errors;
      }

      const result = await create(req.body, req.user._id);

      res.redirect("/dashboard");
    } catch (error) {
      res.render("create", {
        input: req.body,
        errors: parseError(error).errors,
      });
    }
  }
);

stoneRouter.get("/edit/:id", isUser(), async (req, res) => {
  const stone = await getById(req.params.id);

  if (!stone) {
    res.render("404");
    return;
  }

  const isOwner = req.user._id === stone.owner.toString();

  if (!isOwner) {
    res.redirect("/login");
    return;
  }

  res.render("edit", { input: stone });
});
stoneRouter.post(
  "/edit/:id",
  isUser(),
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 symbols long"),
  body("category")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 symbols long"),
  body("color")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Color must be at least 2 symbols long"),
  body("image")
    .trim()
    .isURL({ require_tld: false })
    .withMessage("Image must start with http:// or https://"),
  body("location")
    .trim()
    .isLength({ min: 5, max: 15 })
    .withMessage("Location must be between 5 and 15 symbols long"),
  body("formula")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Formula must be between 5 and 15 symbols long"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 symbols long"),

  async (req, res) => {
    const stoneId = req.params.id;
    const userId = req.user._id;

    try {
      const validation = validationResult(req);

      if (validation.errors.length) {
        throw validation.errors;
      }

      const result = await update(stoneId, req.body, userId);

      res.redirect("/dashboard/" + stoneId);
    } catch (error) {
      res.render("edit", {
        input: req.body,
        errors: parseError(error).errors,
      });
    }
  }
);

stoneRouter.get("/like/:id", isUser(), async (req, res) => {
  const stoneId = req.params.id;
  const userId = req.user._id;

  try {
    const result = await like(stoneId, userId);
    res.redirect("/dashboard/" + stoneId);
  } catch (error) {
    res.redirect("/");
  }
});

stoneRouter.get("/delete/:id", isUser(), async (req, res) => {
  const stoneId = req.params.id;
  const userId = req.user._id;

  try {
    const result = await deleteById(stoneId, userId);
    res.redirect("/dashboard/");
  } catch (error) {
    res.redirect("/dashboard/" + stoneId);
  }
});

module.exports = { stoneRouter };
