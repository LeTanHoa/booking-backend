const express = require("express");
const serverless = require("serverless-http");
const app = express();
const userRoutes = require("./routes/userRoutes");
const specializationRoutes = require("./routes/specializationRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorInfoRoutes = require("./routes/doctorInfoRouter");
const reviewRoutes = require("./routes/reviewRoutes");
const contactRoutes = require("./routes/contactRoutes");
const blogsRoutes = require("./routes/blogsRoutes");
const branchRoutes = require("./routes/branchRoutes");
const emailRoutes = require("./routes/emailRoutes");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// ✅ Cấu hình CORS dùng thư viện cors
const corsOptions = {
  origin: "http://localhost:3000", // client
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

// ✅ Định tuyến
app.use("/api/users", userRoutes);
app.use("/api/specializations", specializationRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctor_infos", doctorInfoRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/emails", emailRoutes);

app.get("/", (req, res) => {
  res.render("Hello from Booking Care API!");
});
// ✅ Khởi động server
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports.handler = serverless(app);
