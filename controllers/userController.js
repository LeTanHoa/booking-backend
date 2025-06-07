const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check if user exists
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword || "user"]
    );

    res
      .status(201)
      .json({ message: "Tạo tài khoản thành công", userId: result.insertId });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra email
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const user = users[0];

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production", // ✅ false trên localhost
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác" });
    }

    // Xoá password trước khi gửi về frontend
    delete user.password;

    res.json({ message: "Đăng nhập thành công", user });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE role = 'patient'"
    );

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bệnh nhân thành công",
      data: rows,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách người dùng",
      error: error.message,
    });
  }
};
