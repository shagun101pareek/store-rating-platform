const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const ownerRoutes = require("./routes/owner.routes");
const storeRoutes = require("./routes/store.routes");
const ratingRoutes = require("./routes/rating.routes");

const app = express();
app.use(cors());

app.use(express.json({ limit: "2mb" }));
app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Store Rating Platform API is running",
    });
  });

  app.use(express.json({ limit: "2mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/stores", storeRoutes);

app.use("/api/ratings", ratingRoutes);

app.use("/api/owner", ownerRoutes);

module.exports = app;