const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { uploadImage } = require("../utils/uploadImage");
const jwt = require("jsonwebtoken");
exports.getAllDoctors = async (req, res) => {
  try {
    const [doctors] = await pool.query(`
        SELECT 
          d.*, 
          s.name AS specialization_name 
        FROM 
          doctors d
        JOIN 
          specializations s ON d.specialization_id = s.id
      `);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.createDoctor = async (req, res) => {
  const {
    name,
    email,
    phone_number,
    gender,
    dob,
    address,
    degree,
    experience,
    rating,
    working_hours,
    status,
    specialization_id,
    password,
  } = req.body;

  try {
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadImage(req.file);
      imageUrl = uploadResult.url;
    }

    const [existingDoctors] = await pool.query(
      "SELECT * FROM doctors WHERE email = ?",
      [email]
    );
    if (existingDoctors.length > 0) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      `INSERT INTO doctors 
      (name, email, phone_number, gender, dob, address, degree, experience,rating, image, working_hours, status, specialization_id, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone_number,
        gender,
        dob,
        address,
        degree,
        experience,
        rating,
        imageUrl,
        working_hours,
        status,
        specialization_id,
        hashedPassword,
      ]
    );
    res
      .status(201)
      .json({ message: "Thêm bác sĩ thành công", doctorId: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi khi thêm bác sĩ" });
  }
};

exports.updateDoctor = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone_number,
    gender,
    dob,
    address,
    degree,
    experience,
    working_hours,
    status,
    specialization_id,
    password, // Có thể có hoặc không
    old_image, // thêm trường nhận ảnh cũ từ frontend (nếu cần)
  } = req.body;

  try {
    // Lấy ảnh cũ hiện tại của bác sĩ
    const [rows] = await pool.query("SELECT image FROM doctors WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Bác sĩ không tồn tại" });
    }
    const currentImage = rows[0].image;

    // Nếu có ảnh mới upload thì upload ảnh mới, nếu không thì giữ ảnh cũ
    let imageUrl = currentImage;
    if (req.file) {
      const uploadResult = await uploadImage(req.file);
      imageUrl = uploadResult.url;
    } else if (old_image) {
      // nếu frontend gửi old_image thì dùng luôn ảnh đó (để đảm bảo)
      imageUrl = old_image;
    }

    // Xây dựng câu query UPDATE
    let query = `
        UPDATE doctors 
        SET name=?, email=?, phone_number=?, gender=?, dob=?, address=?, degree=?, experience=?, working_hours=?, status=?, specialization_id=?, image=?
      `;
    const values = [
      name,
      email,
      phone_number,
      gender,
      dob,
      address,
      degree,
      experience,
      working_hours,
      status,
      specialization_id,
      imageUrl,
    ];

    // Nếu có mật khẩu mới → hash và thêm vào query
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query += `, password=?`;
      values.push(hashedPassword);
    }

    query += ` WHERE id=?`;
    values.push(id);

    await pool.query(query, values);

    res.json({ message: "Cập nhật bác sĩ thành công" });
  } catch (err) {
    console.error("Lỗi updateDoctor:", err);
    res.status(500).json({ message: "Lỗi khi cập nhật bác sĩ" });
  }
};

exports.deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM doctors WHERE id = ?", [id]);
    res.json({ message: "Xoá bác sĩ thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi khi xoá bác sĩ" });
  }
};

exports.loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra email
    const [doctors] = await pool.query(
      "SELECT * FROM doctors WHERE email = ?",
      [email]
    );

    if (doctors.length === 0) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const doctor = doctors[0];

    const token = jwt.sign(doctor, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,

      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production", // ✅ false trên localhost
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });
    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác" });
    }

    // Xoá password trước khi gửi về frontend
    delete doctor.password;

    res.json({ message: "Đăng nhập thành công", doctor });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getDoctorById = async (id) => {
  return rows[0];
};
exports.getDoctorProfile = async (req, res) => {
  const { id } = req.params; // Lấy id từ token đã decode
  try {
    const [rows] = await pool.query(`SELECT * FROM doctors WHERE id = ?`, [id]);

    res.json(rows);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin bác sĩ:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
exports.changePasswordDoctor = async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword)
    return res.status(400).json({ message: "Thiếu mật khẩu mới" });

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE doctors SET password = ? WHERE id = ?", [
      hashed,
      req.params.id,
    ]);
    res.json({ message: "Cập nhật mật khẩu thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
