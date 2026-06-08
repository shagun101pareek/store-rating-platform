const {
  getAdminDashboard,
} = require("../services/dashboard.service");
const { sendServerError } = require("../utils/httpErrors");

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
    return sendServerError(res);
  }
};

module.exports = {
  getAdminDashboardController,
};