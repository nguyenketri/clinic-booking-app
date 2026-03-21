const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. KẾT NỐI DATABASE ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// --- 2. MODELS ---
// Bác sĩ/Phòng khám
const DoctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  price: Number,
});
const Doctor = mongoose.model("Doctor", DoctorSchema);

// Lịch đặt khám
const BookingSchema = new mongoose.Schema({
  patientName: String,
  phone: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  date: String,
  status: { type: String, default: "Pending" },
});
const Booking = mongoose.model("Booking", BookingSchema);

// --- 3. API ROUTES (CRUD) ---
// Lấy danh sách bác sĩ
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm bác sĩ (Dùng Postman để thêm data mẫu ban đầu)
app.post("/api/doctors", async (req, res) => {
  const newDoctor = new Doctor(req.body);
  await newDoctor.save();
  res.status(201).json(newDoctor);
});

// Đặt lịch khám
app.post("/api/bookings", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res
      .status(201)
      .json({ message: "Đặt lịch thành công!", booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy lịch sử đặt khám
app.get("/api/bookings", async (req, res) => {
  const bookings = await Booking.find().populate("doctorId");
  res.json(bookings);
});

// --- 4. KHỞI CHẠY SERVER ---
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`🚀 Server chạy tại port ${PORT}`));
