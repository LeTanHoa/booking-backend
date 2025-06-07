// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.get("/", contactController.getAllContacts);
router.post("/", contactController.createContact);
router.get("/:id", contactController.getContactById);
router.put("/:id/status", contactController.updateContact);
router.delete("/:id", contactController.deleteContact);

module.exports = router;
