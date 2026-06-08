const { validationResult } = require("express-validator");

const {
  createRating,
  updateRating,
} = require("../services/rating.service");

const createRatingController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { storeId, rating } = req.body;

    const result = await createRating(
      req.user.id,
      storeId,
      rating
    );

    return res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      rating: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRatingController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { rating } = req.body;
    const { storeId } = req.params;

    const result = await updateRating(
      req.user.id,
      storeId,
      rating
    );

    return res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      rating: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRatingController,
  updateRatingController,
};