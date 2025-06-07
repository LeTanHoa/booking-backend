const express = require("express");
const {
  createReview,
  getReviewsByDoctor,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const router = express.Router();

router.post("/", createReview);
router.get("/doctor/:doctor_id", getReviewsByDoctor);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
