const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Doctor = require("./models/Doctor");
const Booking = require("./models/Booking");
const Message = require("./models/Message");

const specialties = ["Nha khoa", "Da liễu", "Tim mạch", "Nội tổng quát", "Nhi khoa", "Sản phụ khoa", "Mắt", "Tai mũi họng", "Thần kinh", "Chỉnh hình"];
const doctorNames = [
  "Bác sĩ Nguyễn Văn An",
  "Bác sĩ Trần Thị Bảo",
  "Bác sĩ Lê Minh Cường",
  "Bác sĩ Phạm Hoàng Duy",
  "Bác sĩ Đặng Thu Em",
  "Bác sĩ Vũ Quang Phúc",
  "Bác sĩ Ngô Mỹ Hạnh",
  "Bác sĩ Lý Thanh Hương",
  "Bác sĩ Đỗ Tuấn Kiệt",
  "Bác sĩ Phan Gia Khiêm"
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Đã kết nối DB...");

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Booking.deleteMany({});
    await Message.deleteMany({});
    console.log("🧹 Đã xóa dữ liệu cũ...");

    // 1. Create 10 Patients
    const patientUsers = [];
    for (let i = 1; i <= 10; i++) {
      patientUsers.push({
        email: `user${i}@clinic.com`,
        password: "123",
        name: `Bệnh nhân ${i}`,
        phone: `09000000${i.toString().padStart(2, "0")}`,
        role: "patient",
      });
    }

    // 2. Create 2 Admins
    const adminUsers = [
      {
        email: "admin1@clinic.com",
        password: "123",
        name: "Admin 1",
        phone: "0888888881",
        role: "admin",
      },
      {
        email: "admin2@clinic.com",
        password: "123",
        name: "Admin 2",
        phone: "0888888882",
        role: "admin",
      },
    ];

    // 3. Create 10 Doctors
    const doctorUsers = [];
    for (let i = 0; i < 10; i++) {
      doctorUsers.push({
        email: `doctor${i + 1}@clinic.com`,
        password: "123",
        name: doctorNames[i],
        phone: `09111111${(i + 1).toString().padStart(2, "0")}`,
        role: "doctor",
      });
    }

    const allUsers = [...patientUsers, ...adminUsers, ...doctorUsers];
    const createdUsers = [];
    for (const user of allUsers) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }
    console.log("✅ Thêm 22 người dùng thành công (có băm mật khẩu)!");

    // 4. Create 10 Doctor Profiles
    const doctorProfiles = [];
    const createdDoctorUsers = createdUsers.filter(u => u.role === "doctor");
    for (let i = 0; i < 10; i++) {
        doctorProfiles.push({
            userId: createdDoctorUsers[i]._id,
            name: createdDoctorUsers[i].name,
            specialty: specialties[i % specialties.length],
            price: (Math.floor(Math.random() * 5) + 2) * 100000,
            experience: Math.floor(Math.random() * 15) + 3,
            qualification: "Bác sĩ Chuyên khoa",
        });
    }
    const createdDoctorProfiles = await Doctor.insertMany(doctorProfiles);
    console.log("✅ Thêm 10 hồ sơ bác sĩ thành công!");

    // 5. Create 30 Bookings
    const bookings = [];
    const createdPatientUsers = createdUsers.filter(u => u.role === "patient");
    for (let i = 0; i < 30; i++) {
        const patient = createdPatientUsers[i % createdPatientUsers.length];
        const doctor = createdDoctorProfiles[i % createdDoctorProfiles.length];
        const date = new Date();
        date.setDate(date.getDate() + (i % 7) + 1);
        
        bookings.push({
            patientId: patient._id,
            doctorId: doctor._id,
            patientName: patient.name,
            phone: patient.phone,
            date: date,
            time: `${8 + (i % 10)}:00`,
            status: i % 5 === 0 ? "cancelled" : (i % 3 === 0 ? "confirmed" : "pending"),
            paymentStatus: i % 2 === 0 ? "completed" : "pending",
            totalPrice: doctor.price,
            notes: "Dữ liệu mẫu demo đặt lịch khám."
        });
    }
    await Booking.insertMany(bookings);
    console.log("✅ Thêm 30 lịch khám mẫu thành công!");

    // 6. Create some Sample Messages
    const messages = [];
    for (let i = 0; i < 5; i++) {
        messages.push({
            senderId: createdPatientUsers[0]._id,
            receiverId: createdDoctorUsers[0]._id,
            message: `Tin nhắn mẫu ${i + 1} từ bệnh nhân tới bác sĩ.`,
        });
        messages.push({
            senderId: createdDoctorUsers[0]._id,
            receiverId: createdPatientUsers[0]._id,
            message: `Phản hồi mẫu ${i + 1} từ bác sĩ tới bệnh nhân.`,
        });
    }
    await Message.insertMany(messages);
    console.log("✅ Thêm tin nhắn mẫu thành công!");

    console.log("🎉 Toàn bộ dữ liệu Seeding đã hoàn tất!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi Seeding:", err);
    process.exit(1);
  }
};

seedDB();
