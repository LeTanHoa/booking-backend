const db = require("../config/db"); // Đảm bảo đã cấu hình db connection

// Lấy tất cả chi nhánh
exports.getAllBranches = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM branches ORDER BY created_at DESC"
    );
    res.json(results);
  } catch (error) {
    console.log(error);
  }
};

// Tạo chi nhánh mới
exports.createBranch = async (req, res) => {
  const { branch_name, address, phone_number } = req.body;
  try {
    const [check] = await db.query(
      "SELECT * FROM branches WHERE branch_name = ?",
      [branch_name]
    );
    if (check.length > 0) {
      return res.status(400).json({ error: "Chi nhánh đã tồn tại" });
    }

    const [result] = await db.query(
      "INSERT INTO branches (branch_name, address, phone_number) VALUES (?, ?, ?)",
      [branch_name, address, phone_number]
    );
    res.status(201).json({
      message: "Branch created successfully",
      branchId: result.insertId,
      branch_name,
      address,
      phone_number,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Cập nhật chi nhánh
exports.updateBranch = async (req, res) => {
  const { id } = req.params;
  const { branch_name, address, phone_number } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE branches SET branch_name = ?, address = ?, phone_number = ? WHERE id = ?",
      [branch_name, address, phone_number, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.json({ message: "Branch updated successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

// Xóa chi nhánh
exports.deleteBranch = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query("DELETE FROM branches WHERE id = ?", [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};
