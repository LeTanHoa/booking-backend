const { image } = require("../config/cloudinary");
const db = require("../config/db");
const { deleteImage } = require("../utils/deleteImage");
const { uploadImage } = require("../utils/uploadImage");

// CREATE
exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  try {
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadImage(req.file);
      imageUrl = uploadResult.url;
    }

    const [result] = await db.query(
      "INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)",
      [title, content, imageUrl]
    );
    res.status(201).json({
      message: "Tạo blog thành công",
      blogId: result.insertId,
    });
  } catch (error) {
    console.log(error);
  }
};
// READ ALL
exports.getBlogs = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );
    res.json(result);
  } catch (error) {
    console.log(errors);
  }
};

// READ BY ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy" });
    }
    res.json(result[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi khi lấy blog" });
  }
};

// UPDATE
exports.updateBlog = async (req, res) => {
  const { title, content, old_image } = req.body; // lấy old_image từ body
  const id = req.params.id; // lấy id từ params URL

  try {
    const [rows] = await db.query("SELECT image FROM blogs WHERE id = ?", [id]);
    console.log(rows);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Tin tức không tồn tại" });
    }

    const currentImage = rows[0].image;

    let imageUrl = currentImage;

    if (req.file) {
      const uploadResult = await uploadImage(req.file);
      imageUrl = uploadResult.url;
      console.log(imageUrl);
    } else if (old_image) {
      // dùng ảnh cũ frontend gửi lên nếu có
      imageUrl = old_image;
    }

    await db.query(
      "UPDATE blogs SET title = ?, content = ?, image = ? WHERE id = ?",
      [title, content, imageUrl, id]
    );

    res.json({ message: "Cập nhật blog thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi khi cập nhật blog" });
  }
};

// DELETE
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT image FROM blogs WHERE id = ?", [id]);
    if (rows.length > 0 && rows[0].image) {
      const imageUrl = rows[0].image;
      await deleteImage(imageUrl);
    }
    await db.query("DELETE FROM blogs WHERE id = ?", [id]);
    res.json({ message: "Xóa blog thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi khi xóa blog" });
  }
};
