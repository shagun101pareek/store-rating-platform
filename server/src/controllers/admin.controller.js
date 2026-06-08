const { validationResult } = require("express-validator");
const { createUser } = require("../services/admin.service");

const createUserController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const user = await createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const {
  getAllUsers,
  getAllStores,
  getUserById,
  getStoreById,
} = require("../services/admin.service");

const getAllUsersController = async (req, res) => {
  try {
    const { sortBy, order, name, email, address, role } = req.query;

    const users = await getAllUsers(sortBy, order, {
      name,
      email,
      address,
      role,
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllStoresController = async (req, res) => {
  try {
    const { sortBy, order, name, email, address } = req.query;

    const stores = await getAllStores(sortBy, order, {
      name,
      email,
      address,
    });

    return res.status(200).json({
      success: true,
      stores,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getStoreByIdController = async (req, res) => {
  try {
    const store = await getStoreById(req.params.id);

    return res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUserController,
  getAllUsersController,
  getAllStoresController,
  getUserByIdController,
  getStoreByIdController,
};
