const prisma = require("../config/prisma");

const getAdminDashboard = async () => {
  const totalUsers = await prisma.user.count();

  const totalStores = await prisma.store.count();

  const totalRatings = await prisma.rating.count();

  return {
    totalUsers,
    totalStores,
    totalRatings,
  };
};

module.exports = {
  getAdminDashboard,
};