const express = require("express");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const {
  createUserController,
} = require("../controllers/admin.controller");

const {
  createStoreController,
} = require("../controllers/store.controller");

const {
  getAdminDashboardController,
} = require("../controllers/dashboard.controller");

const {
  createUserValidator,
} = require("../validators/admin.validator");

const {
  createStoreValidator,
} = require("../validators/store.validator");

const {
  getAllUsersController,
  getAllStoresController,
} = require("../controllers/admin.controller");

const {
  getUserByIdController,
  getStoreByIdController,
} = require("../controllers/admin.controller");

const router = express.Router();

router.post(
  "/users",
  authenticate,
  authorize("ADMIN"),
  createUserValidator,
  createUserController
);

router.post(
  "/stores",
  authenticate,
  authorize("ADMIN"),
  createStoreValidator,
  createStoreController
);

router.get(
  "/dashboard",
  authenticate,
  authorize("ADMIN"),
  getAdminDashboardController
);

router.get(
  "/users",
  authenticate,
  authorize("ADMIN"),
  getAllUsersController
);

router.get(
  "/users/:id",
  authenticate,
  authorize("ADMIN"),
  getUserByIdController
);

router.get(
  "/stores/:id",
  authenticate,
  authorize("ADMIN"),
  getStoreByIdController
);

router.get(
  "/stores",
  authenticate,
  authorize("ADMIN"),
  getAllStoresController
);

module.exports = router;