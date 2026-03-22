const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Doctor = require("./models/Doctor");

// Sample users and doctors
const sampleUsers = [
  {
    email: "dummy@clinic.com",
    password: "123456",
    name: "Người Dùng Demo",
    phone: "0999999999",
    role: "patient",
  },
  {
    email: "doctor1@clinic.com",
    password: "123456",
    name: "Dr. Nguyễn Văn A",
    phone: "0912345678",
    role: "doctor",
  },
  {
    email: "doctor2@clinic.com",
    password: "123456",
    name: "Dr. Trần Thị B",
    phone: "0987654321",
    role: "doctor",
  },
  {
    email: "doctor3@clinic.com",
    password: "123456",
    name: "Dr. Lê Minh C",
    phone: "0901234567",
    role: "doctor",
  },
  {
    email: "patient@clinic.com",
    password: "123456",
    name: "Bệnh nhân Demo",
    phone: "0911111111",
    role: "patient",
  },
];

const sampleDoctors = [
  {
    name: "Dr. Nguyễn Văn A",
    specialty: "Nha khoa",
    price: 500000,
    experience: 10,
    qualification: "Tiến sĩ Nha khoa",
  },
  {
    name: "Dr. Trần Thị B",
    specialty: "Da liễu",
    price: 300000,
    experience: 8,
    qualification: "Thạc sĩ Da liễu",
  },
  {
    name: "Dr. Lê Minh C",
    specialty: "Tim mạch",
    price: 750000,
    experience: 15,
    qualification: "Giáo sư Tim mạch",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Đã kết nối DB...");

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});

    // Create users - Let the model hash passwords via pre-save hook
    const createdUsers = await User.create(sampleUsers);
    console.log("✅ Thêm người dùng thành công!");

    // Create doctors linked to doctor users (skip dummy user at index 1, then use doctors 1-3)
    const doctorUserIndices = [1, 2, 3]; // Indices of doctor users in createdUsers
    for (let i = 0; i < 3; i++) {
      await Doctor.create({
        userId: createdUsers[doctorUserIndices[i]]._id,
        ...sampleDoctors[i],
      });
    }
    console.log("🎉 Seeding dữ liệu thành công!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
};

seedDB();
