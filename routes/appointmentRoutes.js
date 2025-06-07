const express = require("express");
const {
  createAppointment,
  getAllAppointmentsByIdUser,
  deleteAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getByDoctorAppointment,
} = require("../controllers/appointmentController");
const router = express.Router();

router.get("/", getAllAppointmentsByIdUser);
router.get("/all-appointments", getAllAppointments);

router.post("/", createAppointment);
router.delete("/:id", deleteAppointment);

router.put("/:id/status", updateAppointmentStatus);
router.get("/doctor-appointment/:id", getByDoctorAppointment);

module.exports = router;
