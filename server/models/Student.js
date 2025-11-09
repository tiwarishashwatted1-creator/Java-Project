import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  course: { type: String, required: true },
  year: { type: Number, required: true, min: 1, max: 5 },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ["submitted", "approved", "rejected"], default: "submitted" },
  docs: [{
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
