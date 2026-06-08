const express = require("express");

const {
  getAllStoresController,
} = require("../controllers/store.controller");

const router = express.Router();

const {
  authenticate,
} = require("../middlewares/auth.middleware");

router.get(
  "/",
  authenticate,
  getAllStoresController
);

module.exports = router;