const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: String,
    totalPrice: { type: Number, required: true },
    rating: { type: Number },
    review: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
