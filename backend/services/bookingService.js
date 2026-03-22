// Booking Statistics Service
const Booking = require("../models/Booking");
const Doctor = require("../models/Doctor");

exports.getBookingStats = async () => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });
    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });
    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
    };
  } catch (error) {
    throw error;
  }
};

exports.getDoctorStats = async (doctorId) => {
  try {
    const totalBookings = await Booking.countDocuments({ doctorId });
    const completedBookings = await Booking.countDocuments({
      doctorId,
      status: "completed",
    });
    const pendingBookings = await Booking.countDocuments({
      doctorId,
      status: "pending",
    });

    const doctor = await Doctor.findById(doctorId);

    return {
      doctorName: doctor?.name,
      totalBookings,
      completedBookings,
      pendingBookings,
      rating: doctor?.rating || 0,
      totalRatings: doctor?.totalRatings || 0,
    };
  } catch (error) {
    throw error;
  }
};

exports.getRevenueStats = async (startDate, endDate) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: "$doctorId",
          totalRevenue: { $sum: "$totalPrice" },
          totalBookings: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
    ]);

    return bookings;
  } catch (error) {
    throw error;
  }
};
