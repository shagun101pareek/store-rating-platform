const { body } = require("express-validator");

const createRatingValidator = [
  body("storeId")
    .notEmpty()
    .withMessage("Store ID is required"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

const updateRatingValidator = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

module.exports = {
  createRatingValidator,
  updateRatingValidator,
};