# Hướng Dẫn Chạy Dự Án - Quick Start

## ⚡ Bắt Đầu Nhanh

### 1. Chuẩn bị:

- MongoDB chạy (Local: `mongod` hoặc Atlas)
- Node.js đã cài

### 2. Chạy Backend (Terminal 1):

```bash
cd backend
npm install
node seed.js        # Thêm dữ liệu mẫu
npm start            # Server tại http://localhost:5000
```

### 3. Chạy Frontend (Terminal 2):

```bash
cd frontend
npm install
npm start            # Chọn android / ios / web
```

### 4. Đăng Nhập:

```
Email: dummy@clinic.com
Password: 123456
```

## 🎯 Chính Sách Nhánh Git

```bash
# Main branch - Production
main

# Development branch
develop

# Feature branches
feature/auth
feature/bookings
feature/payments
```

## ✅ Checklist Hoàn Thiện

- ✅ Backend Models (User, Doctor, Booking)
- ✅ Authentication (JWT, Register, Login)
- ✅ API Routes (CRUD)
- ✅ Payment Mock
- ✅ Frontend Screens (6 screens)
- ✅ Navigation (Tab + Stack)
- ✅ Services (API calls)
- ✅ Error Handling
- ✅ Validation
- ✅ Styling (UI/UX)
- ✅ Seed Data
- ✅ README Documentation

## 📱 Screens:

1. **Login** - Đăng nhập
2. **Register** - Đăng ký
3. **Home** - Danh sách bác sĩ
4. **Booking** - Đặt lịch
5. **My Bookings** - Lịch khám của tôi
6. **Profile** - Hồ sơ cá nhân

## 🔧 API Endpoints Chính:

```
Auth:
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile (protected)
PUT    /api/auth/profile (protected)

Doctors:
GET    /api/doctors
GET    /api/doctors/specialties
GET    /api/doctors/:id

Bookings:
POST   /api/bookings (protected)
GET    /api/bookings/my-bookings (protected)
PATCH  /api/bookings/:id/cancel (protected)
POST   /api/bookings/:id/rate (protected)

Payment:
POST   /api/payment/mock (protected)

Stats:
GET    /api/stats/bookings (protected)
GET    /api/stats/doctor/:doctorId (protected)
```

## 🆘 Lỗi Thường Gặp

| Lỗi                         | Giải Pháp                  |
| --------------------------- | -------------------------- |
| `ECONNREFUSED`              | Backend chưa chạy          |
| `Cannot POST /api/bookings` | Thiếu Authorization header |
| `MongoDB connection failed` | MongoDB service chưa chạy  |
| `API_URL is undefined`      | Cập nhật constants/api.js  |

---

Tất cả đã hoàn thành! Happy coding! 🚀
