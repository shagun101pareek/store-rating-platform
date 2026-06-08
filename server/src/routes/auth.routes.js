const express = require("express");

const { signup, login, changePasswordController} = require("../controllers/auth.controller");
const { signupValidator, loginValidator, changePasswordValidator } = require("../validators/auth.validator");
const {
  authenticate,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login",loginValidator, login);
router.patch(
  "/change-password",
  authenticate,
  changePasswordValidator,
  changePasswordController
);

module.exports = router;