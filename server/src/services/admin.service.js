const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

const createUser = async (userData) => {
  const { name, email, address, password, role } = userData;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      address,
      password: hashedPassword,
      role,
    },
  });

  return user;
};

const buildUserOrderBy = (sortBy, order) => {
  const allowedSortBy = ["name", "email", "address", "role"];
  const allowedOrder = ["asc", "desc"];

  if (!sortBy || !allowedSortBy.includes(sortBy)) {
    return undefined;
  }

  const sortOrder = allowedOrder.includes(order) ? order : "asc";

  return {
    [sortBy]: sortOrder,
  };
};

const buildStoreOrderBy = (sortBy, order) => {
  const allowedSortBy = ["name", "email", "address"];
  const allowedOrder = ["asc", "desc"];

  if (!sortBy || !allowedSortBy.includes(sortBy)) {
    return undefined;
  }

  const sortOrder = allowedOrder.includes(order) ? order : "asc";

  return {
    [sortBy]: sortOrder,
  };
};

const buildUserFilters = (filters = {}) => {
  const { name, email, address, role } = filters;
  const conditions = [];

  if (name) {
    conditions.push({
      name: { contains: name, mode: "insensitive" },
    });
  }

  if (email) {
    conditions.push({
      email: { contains: email, mode: "insensitive" },
    });
  }

  if (address) {
    conditions.push({
      address: { contains: address, mode: "insensitive" },
    });
  }

  if (role) {
    conditions.push({ role });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
};

const buildStoreFilters = (filters = {}) => {
  const { name, email, address } = filters;
  const conditions = [];

  if (name) {
    conditions.push({
      name: { contains: name, mode: "insensitive" },
    });
  }

  if (email) {
    conditions.push({
      email: { contains: email, mode: "insensitive" },
    });
  }

  if (address) {
    conditions.push({
      address: { contains: address, mode: "insensitive" },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
};

const computeAverageRating = (ratings) => {
  if (ratings.length === 0) return 0;
  return (
    ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
  ).toFixed(1);
};

const getAllUsers = async (sortBy, order, filters = {}) => {
  const orderBy = buildUserOrderBy(sortBy, order);
  const where = buildUserFilters(filters);

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
    ...(orderBy && { orderBy }),
  });

  return users;
};

const getAllStores = async (sortBy, order, filters = {}) => {
  const orderBy = buildStoreOrderBy(sortBy, order);
  const where = buildStoreFilters(filters);

  const stores = await prisma.store.findMany({
    where,
    include: {
      ratings: true,
    },
    ...(orderBy && { orderBy }),
  });

  const mapped = stores.map((store) => ({
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    rating: computeAverageRating(store.ratings),
  }));

  if (sortBy === "rating") {
    const sortOrder = order === "desc" ? -1 : 1;
    mapped.sort(
      (a, b) => (Number(a.rating) - Number(b.rating)) * sortOrder
    );
  }

  return mapped;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      ownedStore: {
        include: {
          ratings: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { ownedStore, ...userData } = user;

  const result = { ...userData };

  if (user.role === "STORE_OWNER" && ownedStore) {
    result.ownedStore = {
      id: ownedStore.id,
      name: ownedStore.name,
      averageRating: computeAverageRating(ownedStore.ratings),
    };
  }

  return result;
};

const getStoreById = async (id) => {
  const store = await prisma.store.findUnique({
    where: {
      id,
    },
    include: {
      ratings: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    owner: store.owner,
    averageRating: computeAverageRating(store.ratings),
  };
};

module.exports = {
  createUser,
  getAllUsers,
  getAllStores,
  getUserById,
  getStoreById,
};
