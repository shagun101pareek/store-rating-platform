const express = require("express");

const {
  authenticate,
} = require("../middlewares/auth.middleware");

const {
  authorize,
} = require("../middlewares/role.middleware");

const {
  getOwnerDashboardController,
  getStoreRatingsController,
  getOwnerStoreController,
  updateOwnerStoreController,
} = require("../controllers/owner.controller");

const {
  updateStoreProfileValidator,
} = require("../validators/store.validator");

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorize("STORE_OWNER"),
  getOwnerDashboardController
);

router.get(
  "/ratings",
  authenticate,
  authorize("STORE_OWNER"),
  getStoreRatingsController
);

router.get(
  "/store",
  authenticate,
  authorize("STORE_OWNER"),
  getOwnerStoreController
);

router.patch(
  "/store",
  authenticate,
  authorize("STORE_OWNER"),
  updateStoreProfileValidator,
  updateOwnerStoreController
);

module.exports = router;