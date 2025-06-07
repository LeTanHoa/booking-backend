const express = require("express");
const {
  register,
  login,
  getAllUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, (req, res) => {
  console.log(req.user);
  res.json(req.user);
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: false, // true nếu dùng HTTPS
  });
  res.json({ message: "Đã đăng xuất" });
});
router.get("/getAllUser", getAllUser);

module.exports = router;
