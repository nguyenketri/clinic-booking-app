const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const doctorController = require("../controllers/doctorController");
const bookingController = require("../controllers/bookingController");
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");
const bookingService = require("../services/bookingService");
const chatRoutes = require("./chatRoutes");

// ========== AUTH ROUTES ==========
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authMiddleware, authController.getProfile);
router.put("/auth/profile", authMiddleware, authController.updateProfile);

// ========== DOCTOR ROUTES ==========
router.get("/doctors", doctorController.getDoctors);
router.get("/doctors/specialties", doctorController.getSpecialties);
router.get("/doctors/:id", doctorController.getDoctorById);
router.post("/doctors", authMiddleware, doctorController.createDoctor);
router.put("/doctors/:id", authMiddleware, doctorController.updateDoctor);
router.delete("/doctors/:id", authMiddleware, doctorController.deleteDoctor);

// ========== BOOKING ROUTES ==========
router.post("/bookings", authMiddleware, bookingController.createBooking);
router.get(
  "/bookings/my-bookings",
  authMiddleware,
  bookingController.getMyBookings,
);
router.get("/bookings/:id", authMiddleware, bookingController.getBookingById);
router.put("/bookings/:id", authMiddleware, bookingController.updateBooking);
router.patch(
  "/bookings/:id/cancel",
  authMiddleware,
  bookingController.cancelBooking,
);
router.post(
  "/bookings/:id/rate",
  authMiddleware,
  bookingController.rateBooking,
);
router.get("/admin/bookings", authMiddleware, bookingController.getAllBookings);

// ========== PAYMENT ROUTES ==========
router.post(
  "/payment/vnpay",
  authMiddleware,
  paymentController.createVNPayPayment,
);
router.post(
  "/payment/momo",
  authMiddleware,
  paymentController.createMoMoPayment,
);
router.post("/payment/callback", paymentController.handlePaymentCallback);
router.post("/payment/mock", authMiddleware, paymentController.mockPayment);

// ========== STATISTICS ROUTES ==========
router.get("/stats/bookings", authMiddleware, async (req, res) => {
  try {
    const stats = await bookingService.getBookingStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.get("/stats/doctor/:doctorId", authMiddleware, async (req, res) => {
  try {
    const stats = await bookingService.getDoctorStats(req.params.doctorId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.get("/stats/revenue", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await bookingService.getRevenueStats(startDate, endDate);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// ========== CHAT ROUTES ==========
router.use("/chat", chatRoutes);

module.exports = router;
