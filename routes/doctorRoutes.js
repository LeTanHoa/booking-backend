const express = require("express");
const {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  loginDoctor,
  getDoctorProfile,
  changePasswordDoctor,
} = require("../controllers/doctorController");
const upload = require("../config/multerConfig");
const authMiddleware = require("../middleware/auth");
const { pool } = require("../config/db");
const router = express.Router();

router.get("/", getAllDoctors);
router.post("/login-doctor", loginDoctor);
router.get("/doctor-profile/:id", getDoctorProfile);
router.get("/me", authMiddleware, async (req, res) => {
  console.log("Doctor", req.user);
  return res.json(req.user);
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: false, // true nếu dùng HTTPS
  });
  res.json({ message: "Đã đăng xuất" });
});

router.post("/", upload.single("image"), createDoctor);
router.put("/:id", upload.single("image"), updateDoctor);
router.delete("/:id", deleteDoctor);
router.put("/change-password/:id", changePasswordDoctor);

module.exports = router;
