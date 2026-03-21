const mongoose = require("mongoose");
require("dotenv").config();

// Các bác sĩ mẫu
const doctors = [
  { name: "Dr. John Doe", specialty: "Nha khoa", price: 500000 },
  { name: "Dr. Sarah Smith", specialty: "Da liễu", price: 300000 },
  { name: "Dr. Michael Johnson", specialty: "Tim mạch", price: 750000 },
];

const DoctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  price: Number,
});
const Doctor = mongoose.model("Doctor", DoctorSchema);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Đã kết nối DB. Đang thêm dữ liệu...");
    await Doctor.insertMany(doctors);
    console.log("🎉 Thêm dữ liệu thành công! Bạn có thể tắt file này.");
    process.exit();
  })
  .catch((err) => console.log(err));
