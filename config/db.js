const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Thử kết nối ngay sau khi tạo pool
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Kết nối MySQL thành công!");
    connection.release(); // Trả connection về pool
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
  }
})();

module.exports = pool;
