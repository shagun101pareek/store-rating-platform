const { body } = require("express-validator");

const signupValidator = [
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
];

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)
    .withMessage(
      "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
    ),
];

const loginValidator = [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email"),
  
    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ];

module.exports = {
  signupValidator,
  loginValidator,
  changePasswordValidator
};