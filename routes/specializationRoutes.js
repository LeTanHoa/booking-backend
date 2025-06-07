const express = require("express");
const router = express.Router();
const {
  getAllSpecializations,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
} = require("../controllers/specializationController");

router.get("/", getAllSpecializations);
router.post("/", createSpecialization);
router.put("/:id", updateSpecialization);
router.delete("/:id", deleteSpecialization);

module.exports = router;
