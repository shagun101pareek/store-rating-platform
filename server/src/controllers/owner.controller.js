const { validationResult } = require("express-validator");
const {
  getOwnerDashboard,
  getStoreRatings,
  getOwnerStore,
  updateOwnerStore,
} = require("../services/owner.service");

const getOwnerDashboardController = async (
  req,
  res
) => {
  try {
    const dashboard = await getOwnerDashboard(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getStoreRatingsController = async (
  req,
  res
) => {
  try {
    const { sortBy, order } = req.query;

    const ratings = await getStoreRatings(
      req.user.id,
      sortBy,
      order
    );

    return res.status(200).json({
      success: true,
      ratings,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getOwnerStoreController = async (req, res) => {
  try {
    const store = await getOwnerStore(req.user.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    return res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOwnerStoreController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const store = await updateOwnerStore(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Store profile updated successfully",
      store,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getOwnerDashboardController,
  getStoreRatingsController,
  getOwnerStoreController,
  updateOwnerStoreController,
};