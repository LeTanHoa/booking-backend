const pool = require("../config/db");
// Lấy tất cả
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM doctor_infos ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Lấy theo id
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM doctor_infos WHERE doctor_id = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Tạo mới
exports.create = async (req, res) => {
  const { doctor_id, infoGroups } = req.body;
  try {
    const checkExist = await pool.query(
      "SELECT * FROM doctor_infos WHERE doctor_id = ?",
      [doctor_id]
    );
    if (checkExist[0].length > 0) {
      return res.status(400).json({ message: "Thông tin bác sĩ đã tồn tại" });
    }

    const [result] = await pool.query(
      "INSERT INTO doctor_infos (doctor_id, infoGroups) VALUES (?, ?)",
      [doctor_id, JSON.stringify(infoGroups)]
    );
    res.status(201).json({ id: result.insertId, doctor_id, infoGroups });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Cập nhật
exports.update = async (req, res) => {
  const { id } = req.params;
  const { doctor_id, infoGroups } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE doctor_infos SET doctor_id = ?, infoGroups = ? WHERE id = ?",
      [doctor_id, JSON.stringify(infoGroups), id]
    );
    // if (result.affectedRows === 0)
    //   return res.status(404).json({ message: "Không tìm thấy" });
    res.json({ id, doctor_id, infoGroups });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Xóa
exports.deleteInfor = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM doctor_infos WHERE id = ?", [
      id,
    ]);
    // if (result.affectedRows === 0)
    //   return res.status(404).json({ message: "Không tìm thấy" });
    res.json({ message: "Xoá thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
