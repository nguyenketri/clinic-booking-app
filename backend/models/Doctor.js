const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    price: { type: Number, required: true },
    experience: { type: Number, default: 0 },
    qualification: { type: String },
    avatar: { type: String },
    schedule: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Doctor", doctorSchema);
