const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

const registerUser = async (userData) => {
  const { name, email, address, password } = userData;

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
    },
  });

  return user;
};

const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  
    if (!user) {
      throw new Error("Invalid email or password");
    }
  
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
  
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
  
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      }
    );
  
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  };

  const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};
module.exports = {
  registerUser,
  loginUser,
  changePassword,
};