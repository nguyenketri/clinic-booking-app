const Booking = require("../models/Booking");

// Simulate Bank Transfer (CK) payment
exports.createBankTransfer = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Lịch khám không tồn tại" });
    }

    // Set status to pending verification for manually confirmed CK
    booking.paymentStatus = "pending";
    await booking.save();

    res.status(200).json({
      message: "Yêu cầu thanh toán chuyển khoản đã được ghi nhận!",
      bankInfo: {
        bankName: "MB Bank",
        accountNumber: "123456789",
        accountName: "NGUYEN KE TRI",
        amount,
        content: `BookingID ${bookingId.toString().slice(-6).toUpperCase()}`,
      },
      bookingId,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Simulate VNPay payment
exports.createVNPayPayment = async (req, res) => {
  try {
    const { bookingId, amount, returnUrl } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Lịch khám không tồn tại" });
    }

    // Simulate VNPay redirect URL
    const vnpayUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${
      amount * 100
    }&vnp_Command=pay&vnp_CreateDate=${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(
        /-/g,
        "",
      )}&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=BookingID${bookingId}&vnp_OrderType=billpayment&vnp_ReturnUrl=${returnUrl}&vnp_TmnCode=TMNCODE&vnp_TxnRef=${Date.now()}`;

    res.status(200).json({
      message: "Tạo thanh toán thành công!",
      paymentUrl: vnpayUrl,
      bookingId,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Simulate MoMo payment
exports.createMoMoPayment = async (req, res) => {
  try {
    const { bookingId, amount, returnUrl } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Lịch khám không tồn tại" });
    }

    // Simulate MoMo redirect URL
    const momoUrl = `https://test-payment.momo.vn/w98ubwA?orderId=${bookingId}&amount=${amount}&description=BookingID${bookingId}&returnurl=${returnUrl}`;

    res.status(200).json({
      message: "Tạo thanh toán MoMo thành công!",
      paymentUrl: momoUrl,
      bookingId,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Handle payment callback (simulate)
exports.handlePaymentCallback = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Lịch khám không tồn tại" });
    }

    if (status === "success" || status === "00") {
      booking.paymentStatus = "completed";
      booking.status = "confirmed";
    } else {
      booking.paymentStatus = "failed";
    }

    await booking.save();

    res.status(200).json({
      message: "Cập nhật thanh toán thành công!",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Mock payment simulation (for testing without real gateway)
exports.mockPayment = async (req, res) => {
  try {
    const { bookingId, success } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Lịch khám không tồn tại" });
    }

    if (success) {
      booking.paymentStatus = "completed";
      booking.status = "confirmed";
    } else {
      booking.paymentStatus = "failed";
    }

    await booking.save();

    res.status(200).json({
      message: success ? "Thanh toán thành công!" : "Thanh toán thất bại!",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
