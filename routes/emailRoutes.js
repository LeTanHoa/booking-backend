const express = require("express");
const { emailBook, emailStatus } = require("../controllers/emailController");

const router = express.Router();

router.post("/emailBook", emailBook);
router.post("/emailStatus", emailStatus);

module.exports = router;
