const { body } = require("express-validator");

const isValidImageUrl = (value) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (
    typeof value === "string" &&
    value.startsWith("data:image/") &&
    value.length <= 400000
  ) {
    return true;
  }

  throw new Error("Image must be a valid JPEG/PNG under 300KB");
};

const createStoreValidator = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Store name must be between 20 and 60 characters"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("address")
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),

  body("ownerId")
    .notEmpty()
    .withMessage("Owner ID is required"),

  body("imageUrl")
    .optional({ nullable: true })
    .custom(isValidImageUrl),
];

const updateStoreProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Store name must be between 20 and 60 characters"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),

  body("imageUrl")
    .optional({ nullable: true })
    .custom(isValidImageUrl),
];

module.exports = {
  createStoreValidator,
  updateStoreProfileValidator,
};