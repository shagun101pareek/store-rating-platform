require("dotenv").config();

const prisma = require("./config/prisma");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const userCount = await prisma.user.count();

    console.log("Database connected");
    console.log("Users:", userCount);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();