const prisma = require("../config/prisma");

const createStore = async (storeData) => {
  const { name, email, address, ownerId, imageUrl } = storeData;

  const existingStore = await prisma.store.findUnique({
    where: {
      email,
    },
  });

  if (existingStore) {
    throw new Error("Store email already exists");
  }

  const owner = await prisma.user.findUnique({
    where: {
      id: ownerId,
    },
  });

  if (!owner) {
    throw new Error("Store owner not found");
  }

  if (owner.role !== "STORE_OWNER") {
    throw new Error("User is not a store owner");
  }

  const store = await prisma.store.create({
    data: {
      name,
      email,
      address,
      ownerId,
      ...(imageUrl ? { imageUrl } : {}),
    },
  });

  return store;
};

const buildStoreOrderBy = (sortBy, order) => {
  const allowedSortBy = ["name"];
  const allowedOrder = ["asc", "desc"];

  if (!sortBy || !allowedSortBy.includes(sortBy)) {
    return undefined;
  }

  const sortOrder = allowedOrder.includes(order)
    ? order
    : "asc";

  return {
    [sortBy]: sortOrder,
  };
};

const getAllStores = async (
  search,
  userId,
  sortBy,
  order
) => {
  const orderBy = buildStoreOrderBy(
    sortBy,
    order
  );

  const stores = await prisma.store.findMany({
    where: search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              address: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {},
    include: {
      ratings: true,
      owner: {
        select: {
          name: true,
        },
      },
    },
    ...(orderBy && { orderBy }),
  });

  return stores.map((store) => {
    const userRating =
      store.ratings.find(
        (rating) =>
          rating.userId === userId
      );
  
    return {
      id: store.id,
      name: store.name,
      address: store.address,
      imageUrl: store.imageUrl,
      ownerName: store.owner.name,

      averageRating:
        store.ratings.length > 0
          ? (
              store.ratings.reduce(
                (sum, rating) =>
                  sum + rating.rating,
                0
              ) / store.ratings.length
            ).toFixed(1)
          : 0,
  
      userRating: userRating
        ? userRating.rating
        : null,
  
      hasRated: !!userRating,
    };
  });
};

module.exports = {
  createStore,
  getAllStores,
};