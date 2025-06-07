const db = require("../config/db");
// Lấy tất cả liên hệ
exports.getAllContacts = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );
    res.json(results);
  } catch (error) {
    console.log(error);
  }
};

// Tạo mới liên hệ
exports.createContact = async (req, res) => {
  const { fullname, email, title, message, user_id } = req.body;

  if (!fullname || !email || !message) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO contacts (fullname, email, title, message, user_id) VALUES (?, ?, ?, ?, ?)",
      [fullname, email, title, message, user_id]
    );

    res.status(201).json({
      message: "Liên hệ đã được gửi thành công",
      contactId: result.insertId,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi tạo liên hệ:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi xử lý liên hệ" });
  }
};

// Lấy liên hệ theo ID
exports.getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query(
      "SELECT * FROM contacts WHERE user_id = ?",
      [id]
    );
    res.json(results);
  } catch (error) {
    console.log(error);
  }
};

// Cập nhật trạng thái hoặc nội dung liên hệ
exports.updateContact = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE contacts SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy liên hệ" });
    }

    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái" });
  }
};

// Xoá liên hệ
exports.deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query("DELETE FROM contacts WHERE id = ?", [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy liên hệ" });
    }
    res.json({ message: "Xoá liên hệ thành công", success: true });
  } catch (error) {
    console.log(error);
  }
};
