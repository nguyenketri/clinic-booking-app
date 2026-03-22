# Ứng dụng Đặt Lịch Khám - Clinic Booking App

## 📋 Mô Tả Dự Án

Ứng dụng di động cho phép bệnh nhân đặt lịch khám với các bác sĩ tại phòng khám. Ứng dụng được xây dựng với **React Native (Expo)** cho frontend và **Node.js (Express)** cho backend, sử dụng **MongoDB** làm cơ sở dữ liệu.

## ✨ Các Tính Năng Chính

### Cho Bệnh Nhân:

- ✅ Đăng ký/Đăng nhập tài khoản
- ✅ Xem danh sách bác sĩ theo chuyên khoa
- ✅ Tìm kiếm bác sĩ
- ✅ Đặt lịch khám với bác sĩ
- ✅ Chọn ngày, giờ khám linh hoạt
- ✅ Xem lịch khám của bản thân
- ✅ Thanh toán giả lập (Mock Payment)
- ✅ Đánh giá bác sĩ
- ✅ Quản lý hồ sơ cá nhân

### Cho Admin:

- ✅ Xem tất cả lịch khám
- ✅ Quản lý thống kê
- ✅ API CRUD đầy đủ

## 🛠 Stack Công Nghệ

### Frontend:

- React Native (Expo)
- TypeScript/JavaScript
- Axios (HTTP client)
- Expo Router (Navigation)
- AsyncStorage (Local storage)
- Material Icons

### Backend:

- Node.js + Express
- MongoDB + Mongoose
- JWT (Authentication)
- Bcrypt (Password hashing)
- CORS

### Database:

- MongoDB (Local hoặc Atlas)

## 📦 Cài Đặt & Chạy Dự Án

### 1️⃣ CHUẨN BỊ

#### Yêu cầu hệ thống:

- Node.js v16+ (https://nodejs.org/)
- MongoDB (Local hoặc MongoDB Atlas - https://www.mongodb.com/cloud/atlas)
- Expo CLI: `npm install -g expo-cli`
- Android Studio + Android Emulator (hoặc thiết bị Android thực)

### 2️⃣ THIẾT LẬP BACKEND

```bash
# Vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Kiểm tra file .env (đã có sẵn)
cat .env
# Nội dung:
# PORT=5000
# MONGODB_URI=mongodb://127.0.0.1:27017/clinic-booking-app
# JWT_SECRET=your-secret-key-change-in-production
# NODE_ENV=development

# Nếu dùng MongoDB Atlas, sửa MONGODB_URI thành:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clinic-booking-app

# Chạy seed data (thêm dữ liệu mẫu)
npm run seed
# hoặc
node seed.js

# Chạy server
npm start
# Server sẽ chạy tại http://localhost:5000
```

### 3️⃣ THIẾT LẬP FRONTEND

```bash
# Kở thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Cập nhật API_URL trong frontend/constants/api.js
# Nếu chạy Android Emulator: http://10.0.2.2:5000/api
# Nếu chạy trên thiết bị thực: http://YOUR_MACHINE_IP:5000/api
# Nếu chạy iOS Simulator: http://localhost:5000/api

# Chạy ứng dụng
npm start

# Hoặc chạy trực tiếp cho Android
npm run android

# Hoặc chạy cho iOS
npm run ios
```

## 🔐 Đăng Nhập Demo

```
Email: dummy@clinic.com
Mật khẩu: 123456

Hoặc đăng ký tài khoản mới bất kỳ lúc nào!
```

## 📱 Cấu Trúc Ứng Dụng

### Backend Routes:

#### Authentication:

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin cá nhân (cần token)
- `PUT /api/auth/profile` - Cập nhật thông tin (cần token)

#### Doctors:

- `GET /api/doctors` - Lấy danh sách bác sĩ
- `GET /api/doctors/:id` - Lấy chi tiết bác sĩ
- `GET /api/doctors/specialties` - Lấy danh sách chuyên khoa

#### Bookings:

- `POST /api/bookings` - Tạo lịch khám mới
- `GET /api/bookings/my-bookings` - Lấy lịch khám của bệnh nhân
- `GET /api/bookings/:id` - Lấy chi tiết lịch khám
- `PUT /api/bookings/:id` - Cập nhật lịch khám
- `PATCH /api/bookings/:id/cancel` - Hủy lịch khám
- `POST /api/bookings/:id/rate` - Đánh giá lịch khám

#### Payment (Mock):

- `POST /api/payment/mock` - Thanh toán giả lập

#### Statistics:

- `GET /api/stats/bookings` - Thống kê lịch khám
- `GET /api/stats/doctor/:doctorId` - Thống kê bác sĩ
- `GET /api/stats/revenue` - Thống kê doanh thu

### Frontend Screens:

| Screen      | Đường dẫn            | Mô tả             |
| ----------- | -------------------- | ----------------- |
| Login       | `/login`             | Đăng nhập         |
| Register    | `/register`          | Đăng ký           |
| Home        | `/(tabs)`            | Danh sách bác sĩ  |
| Booking     | `/booking`           | Đặt lịch khám     |
| My Bookings | `/(tabs)/mybookings` | Lịch khám của tôi |
| Profile     | `/(tabs)/profile`    | Hồ sơ cá nhân     |

## 📊 Mô Hình Dữ Liệu

### User (Người dùng)

```javascript
{
  email: String (unique),
  password: String (hash),
  name: String,
  phone: String,
  role: String (patient/doctor/admin),
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor (Bác sĩ)

```javascript
{
  userId: ObjectId (ref User),
  name: String,
  specialty: String,
  price: Number,
  experience: Number,
  qualification: String,
  avatar: String,
  schedule: Array,
  rating: Number,
  totalRatings: Number
}
```

### Booking (Lịch khám)

```javascript
{
  patientId: ObjectId (ref User),
  doctorId: ObjectId (ref Doctor),
  patientName: String,
  phone: String,
  email: String,
  date: Date,
  time: String,
  notes: String,
  status: String (pending/confirmed/completed/cancelled),
  paymentStatus: String (pending/completed/failed),
  totalPrice: Number,
  rating: Number,
  review: String
}
```

## 🐛 Troubleshooting

### Backend không kết nối MongoDB:

```
Error: Kết nối MongoDB thất bại
Giải pháp:
1. Kiểm tra MongoDB Service đang chạy:
   - Windows: Mở Services, tìm MongoDB Server, nhấn Start
   - Mac/Linux: `mongod` hoặc `brew services start mongodb-community`
2. Kiểm tra lại MONGODB_URI trong .env
3. Đảm bảo MongoDB Atlas (nếu dùng) IP whitelist được thêm
```

### Frontend không kết nối backend:

```
Error: Network Error / Cannot connect to API
Giải pháp:
1. Kiểm tra backend đang chạy (port 5000)
2. Cập nhật API_URL trong constants/api.js đúng IP
3. Kiểm tra firewall cho phép port 5000
4. Dùng: adb reverse tcp:5000 tcp:5000 (Android real device)
```

### Lỗi TypeScript trong frontend:

```
Error: Type unknown sau axios
Giải pháp:
1. Cài đặt type definitions: npm install --save-dev @types/react-native
2. Restart terminal và IDE
```

## 📈 Các Chức Năng Nâng Cao (Khuyến khích có)

✅ **Đã implement:**

- Authentication & JWT
- Payment Mock (VNPay/MoMo)
- Rating & Review
- Statistics
- Multi-user support

**Có thể thêm vào tương lai:**

- Video call consultation
- Prescription management
- Medical records
- Push notifications
- Real payment gateway integration
- Admin dashboard web

## 🚀 Deployment

### Deploy Backend (Heroku/Railway):

```bash
# Tạo Procfile:
echo "web: npm start" > Procfile

# Deploy lên Heroku:
heroku create your-app-name
git push heroku main
```

### Deploy Frontend (Expo/Google Play):

```bash
# Build APK:
eas build --platform android

# Submit to Play Store:
eas submit --platform android
```

## 📝 Notes

- Dữ liệu seed mẫu được tạo tự động khi chạy `npm run seed`
- Các lịch khám chỉ có thể đặt từ ngày mai trở đi
- Thanh toán là mock, không thực tế liên kết với gateway thực
- JWT token hết hạn sau 7 ngày

## 👨‍💻 Tác Giả

Sinh viên MMA301 - Trường Cao Đẳng FPT Polytechnic

## 📧 Liên Hệ & Hỗ Trợ

Nếu gặp vấn đề, liên hệ:

- Email: support@clinic-booking.com
- GitHub Issues: [Link repo]

---

**Happy Coding! 🎉**
