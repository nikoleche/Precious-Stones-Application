const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { isGuest } = require("../middlewares/guards");
const { register, login } = require("../services/userService");
const { generateToken } = require("../services/jwt");
const { parseError } = require("../util");

const userRouter = Router();

userRouter.get("/register", isGuest(), (req, res) => {
  res.render("register");
});
userRouter.post(
  "/register",
  isGuest(),
  body("email")
    .trim()
    .isEmail()
    .isLength({ min: 10 })
    .withMessage("Email address must be at least 10 symbols"),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 symbols"),
  body("repeatpw")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords don't match"),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const validation = validationResult(req);

      if (validation.errors.length) {
        throw validation.errors;
      }

      const result = await register(email, password);
      const token = generateToken(result);

      res.cookie("token", token);
      res.redirect("/");
    } catch (error) {
      res.render("register", {
        input: { email },
        errors: parseError(error).errors,
      });
    }
  }
);

userRouter.get("/login", isGuest(), (req, res) => {
  res.render("login");
});
userRouter.post(
  "/login",
  isGuest(),
  body("email").trim(),
  body("password").trim(),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await login(email, password);
      const token = generateToken(result);
      res.cookie("token", token);
      res.redirect("/");
    } catch (error) {
      res.render("login", {
        input: { email },
        errors: parseError(error).errors,
      });
    }
  }
);

userRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = { userRouter };
