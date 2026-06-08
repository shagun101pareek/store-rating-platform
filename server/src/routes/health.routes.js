const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// router.get(
//     "/protected",
//     authenticate,
//     (req, res) => {
//       res.json({
//         success: true,
//         user: req.user,
//       });
//     }
//   );

  router.get(
    "/admin-only",
    authenticate,
    (req, res) => {
      res.json({
        success: true,
        message: "Welcome Admin",
      });
    }
  );

module.exports = router;