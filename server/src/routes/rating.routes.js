const express = require("express");

const {
  createRatingController,
  updateRatingController,
} = require("../controllers/rating.controller");

const {
  createRatingValidator,
  updateRatingValidator,
} = require("../validators/rating.validator");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("USER"),
  createRatingValidator,
  createRatingController
);

router.patch(
  "/:storeId",
  authenticate,
  authorize("USER"),
  updateRatingValidator,
  updateRatingController
);

module.exports = router;