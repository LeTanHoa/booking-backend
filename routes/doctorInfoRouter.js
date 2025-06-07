const express = require("express");
const {
  getAll,
  getById,
  create,
  update,
  deleteInfor,
} = require("../controllers/doctorInfoController");
const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteInfor);

module.exports = router;
