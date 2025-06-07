const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailBook = (req, res) => {
  const {
    userEmail,
    patientName,
    doctor_name,
    specialization_name,
    date,
    shift,
    phone_doctor,
    phone,
  } = req.body;

  const emailTemplate = `

   <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f4f8; margin: 0; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; color: #0d47a1; margin-bottom: 20px;">
                <h2 style="margin: 0;">Xác Nhận Lịch Hẹn Thành Công - Mã số <strong>#${patientName}-${phone}</strong> </h2>
            </div>
            <div>
                <p style="font-size: 16px; line-height: 1.6; margin: 8px 0;">
                Xin chào <span style="color: #0d47a1; font-weight: bold;">${patientName} - ${phone}</span>,
                </p>
                <p style="font-size: 16px; line-height: 1.6; margin: 8px 0;">
                Bạn đã đặt lịch hẹn thành công tại <span style="color: #0d47a1; font-weight: bold;">Bệnh viện 247</span>. Dưới đây là chi tiết lịch hẹn của bạn:
                </p>

                <div style="background-color: #f1f5f9; padding: 20px; border-radius: 10px; margin-top: 15px;">
                <p style="margin: 6px 0; font-size: 15px;"><strong>Bác sĩ:</strong> ${doctor_name}</p>
                <p style="margin: 6px 0; font-size: 15px;"><strong>Chuyên khoa:</strong> ${specialization_name}</p>
                <p style="margin: 6px 0; font-size: 15px;"><strong>Ngày hẹn:</strong> ${date}</p>
                <p style="margin: 6px 0; font-size: 15px;"><strong>Thời gian:</strong> ${shift}</p>
                <p style="margin: 6px 0; font-size: 15px;"><strong>Số điện thoại bác sĩ:</strong> ${phone_doctor} </p>
                </div>

                <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                Vui lòng chờ hệ thống duyệt lịch hẹn. Bạn có thể theo dõi lịch hẹn tại mail được đăng ký hoặc trong trang lịch hẹn của trang web. Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ, bạn có thể liên hệ với chúng tôi qua thông tin dưới đây.
                </p>
            </div>

            <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #666;">
                <p style="margin: 4px 0;">☎️ Hotline: 1900 1234 567</p>
                <p style="margin: 4px 0;">📧 Email: lienhe@benhvien247.vn</p>
                <p style="margin: 4px 0;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            </div>
        </div>
    </body>
`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Booking Care Plus - Đặt lịch hẹn khám bệnh",
    html: emailTemplate,
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Lỗi khi gửi email:", error);
      return res.status(200).json({
        success: false,
        message: "Gửi email thất bại",
        error,
      });
    } else {
      console.log("Email gửi thành công:", info.response);
      return res.status(200).json({
        success: true,
        message: "Email đã được gửi",
      });
    }
  });
};

const emailStatus = (req, res) => {
  const { email, username, status, phone } = req.body;

  try {
    let message = "";
    let title = "";
    let subject = "Booking Care Plus - Cập nhật lịch khám bệnh";

    switch (status) {
      case "approved":
        title = "Lịch hẹn của bạn đã được xác nhận!";
        message = `
            Lịch hẹn của bạn với mã số <strong>#${username}-${phone}</strong> đã được <strong>phê duyệt</strong>.
            Vui lòng đến sớm hơn 15 phút để làm thủ tục và mang theo giấy tờ tùy thân khi đến khám.`;
        break;
      case "rejected":
        title = "Lịch hẹn của bạn đã bị từ chối";
        message = `
            Rất tiếc, lịch hẹn <strong>#${username}-${phone}</strong> của bạn đã bị <strong>từ chối</strong> do không đáp ứng được yêu cầu.
            Vui lòng thử đặt lịch lại hoặc liên hệ với chúng tôi để được hỗ trợ thêm.`;
        break;
      case "complete":
        title = "🎉 Lịch hẹn của bạn đã hoàn tất!";
        message = `
            Cảm ơn bạn đã sử dụng dịch vụ của <strong>Booking Care Plus</strong>!
            Lịch hẹn <strong>#${username}-${phone}</strong> đã được <strong>hoàn tất</strong>. Chúng tôi hy vọng bạn hài lòng với trải nghiệm.`;
        break;
      default:
        title = "📋 Cập nhật về lịch hẹn của bạn";
        message = `Trạng thái lịch hẹn <strong>#${username}-${phone}</strong> của bạn đã được cập nhật: <strong>${status}</strong>.`;
        break;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f7f7f7; padding: 20px;">
            <div style="max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 8px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #0d47a1; text-align: center;">${title}</h2>
              <p style="font-size: 16px;">Xin chào <strong>${username}</strong>,</p>
              <p style="font-size: 15px;">${message}</p>
              <p style="font-size: 14px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline bên dưới.</p>
              <div style="margin-top: 30px; font-size: 13px; color: #666;">
                <p>📧 Email: lienhe@bookingcareplus.vn</p>
                <p>☎️ Hotline: 1900 1234 567</p>
                <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ!</p>
              </div>
            </div>
          </div>
        `,
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Lỗi khi gửi email:", error);
        res.status(500).send("Gửi email thất bại");
      } else {
        console.log("Email gửi thành công:", info.response);
        res.status(200).send("Email đã được gửi");
      }
    });
  } catch (error) {
    console.log("Lỗi khi gửi email:", error);
    res.status(500).send("Gửi email thất bại");
  }
};

module.exports = {
  emailBook,
  emailStatus,
};
