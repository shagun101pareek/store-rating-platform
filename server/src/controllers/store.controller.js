const { validationResult } = require("express-validator");
const { sendServerError } = require("../utils/httpErrors");

const {
  createStore,
  getAllStores,
} = require("../services/store.service");

const createStoreController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const store = await createStore(req.body);

    return res.status(201).json({
      success: true,
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllStoresController = async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;

    const stores = await getAllStores(
      search,
      req.user.id,
      sortBy,
      order
    );

    return res.status(200).json({
      success: true,
      stores,
    });
  } catch (error) {
    return sendServerError(res);
  }
};

module.exports = {
  createStoreController,
  getAllStoresController,
};