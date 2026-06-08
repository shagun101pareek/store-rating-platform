const prisma = require("../config/prisma");

const buildRatingOrderBy = (sortBy, order) => {
  const allowedOrder = ["asc", "desc"];
  const sortOrder = allowedOrder.includes(order) ? order : "asc";

  switch (sortBy) {
    case "name":
      return { user: { name: sortOrder } };
    case "email":
      return { user: { email: sortOrder } };
    case "rating":
      return { rating: sortOrder };
    case "createdAt":
      return { createdAt: sortOrder };
    default:
      return { createdAt: "desc" };
  }
};

const getOwnerDashboard = async (ownerId) => {
  const store = await prisma.store.findFirst({
    where: {
      ownerId,
    },
    include: {
      ratings: true,
    },
  });

  if (!store) {
    return {
      storeName: null,
      totalRatings: 0,
      averageRating: 0,
      hasStore: false,
    };
  }

  const totalRatings = store.ratings.length;

  const averageRating =
    totalRatings > 0
      ? store.ratings.reduce(
          (sum, rating) => sum + rating.rating,
          0
        ) / totalRatings
      : 0;

  return {
    storeName: store.name,
    totalRatings,
    averageRating,
    hasStore: true,
  };
};

const getStoreRatings = async (ownerId, sortBy, order) => {
  const store = await prisma.store.findFirst({
    where: {
      ownerId,
    },
  });

  if (!store) {
    return [];
  }

  const ratings = await prisma.rating.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: buildRatingOrderBy(sortBy, order),
  });

  return ratings;
};

const getOwnerStore = async (ownerId) => {
  const store = await prisma.store.findFirst({
    where: { ownerId },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!store) {
    return null;
  }

  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    imageUrl: store.imageUrl,
    ownerName: store.owner.name,
    ownerEmail: store.owner.email,
  };
};

const updateOwnerStore = async (ownerId, updates) => {
  const store = await prisma.store.findFirst({
    where: { ownerId },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const { name, address, imageUrl } = updates;
  const data = {};

  if (name !== undefined) data.name = name;
  if (address !== undefined) data.address = address;
  if (imageUrl !== undefined) data.imageUrl = imageUrl || null;

  const updatedStore = await prisma.store.update({
    where: { id: store.id },
    data,
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    id: updatedStore.id,
    name: updatedStore.name,
    email: updatedStore.email,
    address: updatedStore.address,
    imageUrl: updatedStore.imageUrl,
    ownerName: updatedStore.owner.name,
    ownerEmail: updatedStore.owner.email,
  };
};

module.exports = {
  getOwnerDashboard,
  getStoreRatings,
  getOwnerStore,
  updateOwnerStore,
};
