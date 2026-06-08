const { body } = require("express-validator");

const createUserValidator = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),

  body("password")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)
    .withMessage(
      "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
    ),

  body("role")
    .isIn(["ADMIN", "USER", "STORE_OWNER"])
    .withMessage("Invalid role"),
];

module.exports = {
  createUserValidator,
};