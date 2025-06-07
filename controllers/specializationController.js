const pool = require("../config/db");

exports.getAllSpecializations = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM specializations");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách chuyên khoa" });
  }
};

exports.createSpecialization = async (req, res) => {
  const { name, image, description } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO specializations (name, image, description) VALUES (?, ?, ?)",
      [name, image, description]
    );
    res.status(201).json({ id: result.insertId, name, image, description });
  } catch (err) {
    console.log(error)
    res.status(500).json({ message: "Lỗi khi thêm chuyên khoa" });
  }
};

exports.updateSpecialization = async (req, res) => {
  const { id } = req.params;
  const { name, image, description } = req.body;
  try {
    await pool.query(
      "UPDATE specializations SET name=?, image=?, description=? WHERE id=?",
      [name, image, description, id]
    );
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật chuyên khoa" });
  }
};

exports.deleteSpecialization = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM specializations WHERE id = ?", [id]);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa chuyên khoa" });
  }
};
