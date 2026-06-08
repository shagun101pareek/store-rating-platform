const prisma = require("../config/prisma");

const createRating = async (userId, storeId, rating) => {
  const existingRating = await prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
  });

  if (existingRating) {
    throw new Error("You have already rated this store");
  }

  const newRating = await prisma.rating.create({
    data: {
      rating,
      userId,
      storeId,
    },
  });

  return newRating;
};

const updateRating = async (userId, storeId, rating) => {
  const existingRating = await prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
  });

  if (!existingRating) {
    throw new Error("Rating not found");
  }

  const updatedRating = await prisma.rating.update({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
    data: {
      rating,
    },
  });

  return updatedRating;
};

module.exports = {
  createRating,
  updateRating,
};