const pool = require("../config/db");

exports.getAllAppointments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, 
                d.name AS doctor_name, 
                d.phone_number AS doctor_phone,  
                s.name AS specialization_name
         FROM appointments a
         JOIN doctors d ON a.doctor_id = d.id
         JOIN specializations s ON a.specialization_id = s.id`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error in getAllAppointments:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách lịch hẹn" });
  }
};

exports.getAllAppointmentsByIdUser = async (req, res) => {
  const { idUser } = req.query; // Read from query parameters
  if (!idUser) {
    return res.status(400).json({ message: "Thiếu id người dùng" });
  }
  try {
    const [rows] = await pool.query(
      `SELECT a.*, d.name AS doctor_name, s.name AS specialization_name
         FROM appointments a
         JOIN doctors d ON a.doctor_id = d.id
         JOIN specializations s ON a.specialization_id = s.id
         WHERE a.user_id = ?`,
      [idUser]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error in getAllAppointmentsByIdUser:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách lịch hẹn" });
  }
};

exports.createAppointment = async (req, res) => {
  const {
    patientName,
    userEmail,
    doctor_id,
    specialization_id,
    date,
    shift,
    user_id,
    phone,
    status = "pending",
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO appointments 
        (patientName, userEmail, doctor_id, specialization_id, date, shift, user_id, phone, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientName,
        userEmail,
        doctor_id,
        specialization_id,
        date,
        shift,
        user_id,
        phone,
        status,
      ]
    );
    res.status(201).json({
      message: "Đặt lịch thành công",
      appointmentId: result.insertId,
      success: true,
    });
  } catch (err) {
    console.error("Error in createAppointment:", err);
    res.status(500).json({ message: "Lỗi khi đặt lịch hẹn" });
  }
};

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM appointments WHERE id = ?", [id]);
    res.json({ message: "Xóa lịch hẹn thành công", success: true });
  } catch (err) {
    console.error("Error in deleteAppointment:", err);
    res.status(500).json({ message: "Lỗi khi xóa lịch hẹn" });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE appointments SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái" });
  }
};

exports.getByDoctorAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT a.* , u.phone as phone_user from appointments a JOIN users u ON a.user_id = u.id  WHERE a.doctor_id = ?",
      [id]
    );
    // if (rows.length === 0)
    //   return res.status(404).json({ message: "Không tìm thấy" });
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};
