const Booking = require("../models/Booking");
const Doctor = require("../models/Doctor");

exports.createBooking = async (req, res) => {
  try {
    const { doctorId, patientName, phone, email, date, time, notes } = req.body;

    // Get doctor info
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Bác sĩ không tồn tại" });
    }

    // Create booking
    const newBooking = new Booking({
      patientId: req.userId,
      doctorId,
      patientName,
      phone,
      email,
      date,
      time,
      notes,
      totalPrice: doctor.price,
      status: "pending",
    });

    await newBooking.save();

    // Populate doctor info
    await newBooking.populate("doctorId", "name specialty price");

    res.status(201).json({
      message: "Đặt lịch thành công!",
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ patientId: req.userId })
      .populate("doctorId", "name specialty price avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("doctorId")
      .populate("patientId", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Lịch khám không tồn tại" });
    }

    // Check authorization
    if (
      booking.patientId._id.toString() !== req.userId &&
      req.userRole !== "admin"
    ) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Lịch khám không tồn tại" });
    }

    // Check authorization
    if (
      booking.patientId.toString() !== req.userId &&
      req.userRole !== "admin"
    ) {
      return res.status(403).json({ message: "Không có quyền chỉnh sửa" });
    }

    Object.assign(booking, req.body);
    await booking.save();

    await booking.populate("doctorId", "name specialty price");

    res.status(200).json({
      message: "Cập nhật thành công!",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Lịch khám không tồn tại" });
    }

    if (
      booking.patientId.toString() !== req.userId &&
      req.userRole !== "admin"
    ) {
      return res.status(403).json({ message: "Không có quyền hủy" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      message: "Hủy lịch thành công!",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Chỉ admin có quyền truy cập trang này" });
    }

    const bookings = await Booking.find()
      .populate("doctorId", "name specialty price")
      .populate("patientId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.rateBooking = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Lịch khám không tồn tại" });
    }

    if (booking.patientId.toString() !== req.userId) {
      return res.status(403).json({ message: "Không có quyền đánh giá" });
    }

    booking.rating = rating;
    booking.review = review;
    await booking.save();

    // Update doctor rating
    const allBookings = await Booking.find({
      doctorId: booking.doctorId,
      rating: { $exists: true },
    });
    const avgRating =
      allBookings.reduce((sum, b) => sum + (b.rating || 0), 0) /
      allBookings.length;

    await Doctor.findByIdAndUpdate(booking.doctorId, {
      rating: avgRating,
      totalRatings: allBookings.length,
    });

    res.status(200).json({
      message: "Đánh giá thành công!",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
