const {
  getAdminDashboard,
} = require("../services/dashboard.service");

const getAdminDashboardController = async (
  req,
  res
) => {
  try {
    const dashboard =
      await getAdminDashboard();

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminDashboardController,
};