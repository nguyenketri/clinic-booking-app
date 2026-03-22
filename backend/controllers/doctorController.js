const Doctor = require("../models/Doctor");

exports.getDoctors = async (req, res) => {
  try {
    const { specialty } = req.query;
    let filter = {};
    if (specialty) {
      filter.specialty = specialty;
    }
    const doctors = await Doctor.find(filter).populate("userId", "name avatar");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("userId", "name avatar")
      .select("-userId");
    if (!doctor) {
      return res.status(404).json({ message: "Bác sĩ không tồn tại" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.distinct("specialty");
    res.status(200).json(specialties);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const { name, specialty, price, experience, qualification } = req.body;
    const doctor = new Doctor({
      userId: req.userId,
      name,
      specialty,
      price,
      experience,
      qualification,
    });
    await doctor.save();
    res.status(201).json({ message: "Tạo bác sĩ thành công!", doctor });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doctor) {
      return res.status(404).json({ message: "Bác sĩ không tồn tại" });
    }
    res.status(200).json({ message: "Cập nhật thành công!", doctor });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Bác sĩ không tồn tại" });
    }
    res.status(200).json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
