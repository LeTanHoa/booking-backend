const db = require("../config/db");

// CREATE review
exports.createReview = async (req, res) => {
  try {
    const { doctor_id, user_id, comment } = req.body;

    if (!doctor_id || !user_id || !comment) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    const [sql] = await db.query(
      `INSERT INTO reviews (doctor_id, user_id, comment) VALUES (?, ?, ?)`,
      [doctor_id, user_id, comment]
    );

    res
      .status(201)
      .json({ message: "Tạo review thành công!", reviewId: sql.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server khi tạo review." });
  }
};

// READ: Lấy tất cả reviews của 1 bác sĩ
exports.getReviewsByDoctor = async (req, res) => {
  const { doctor_id } = req.params;

  try {
    const [sql] = await db.query(
      `
        SELECT 
      reviews.id AS review_id,
      reviews.comment,
      reviews.created_at,
      users.name AS user_name,
      doctors.name AS doctor_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    JOIN doctors ON reviews.doctor_id = doctors.id
    WHERE reviews.doctor_id = ?
    ORDER BY reviews.created_at DESC
      `,
      [doctor_id]
    );
    res.status(201).json({ message: "Tất cả review thành công!", data: sql });
  } catch (error) {
    console.log(error);
  }
};

// UPDATE review
exports.updateReview = (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const sql = `
    UPDATE reviews
    SET comment = ?
    WHERE id = ?
  `;

  db.query(sql, [comment, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json({ message: "Cập nhật review thành công!" });
  });
};

// DELETE review
exports.deleteReview = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM reviews
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json({ message: "Xoá review thành công!" });
  });
};
