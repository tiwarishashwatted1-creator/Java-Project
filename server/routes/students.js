import express from "express";
import multer from "multer";
import { body, validationResult } from "express-validator";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import Student from "../models/Student.js";
import { sendMail } from "../utils/mailer.js";
import { sendSMS } from "../utils/sms.js";

const router = express.Router();
const upload = multer({ dest: "uploads/", limits: { fileSize: 5 * 1024 * 1024 } });

// Create/submit student registration (by logged-in student)
router.post("/",
  auth,
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("dob").notEmpty(),
  body("course").notEmpty(),
  body("year").isInt({ min: 1, max: 5 }),
  body("email").isEmail(),
  body("phone").notEmpty(),
  body("address").notEmpty(),
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const exists = await Student.findOne({ user: req.user._id });
  if (exists) return res.status(400).json({ message: "You have already submitted a registration." });

  const student = await Student.create({ user: req.user._id, ...req.body, status: "submitted" });
  await sendMail({ to: student.email, subject: "Registration submitted",
    html: `<p>Hi ${student.firstName}, your registration has been submitted.</p>` });
  await sendSMS(student.phone, "Your registration has been submitted.");
  res.status(201).json(student);
});

// Upload documents
router.post("/:id/docs", auth, upload.array("docs", 5), async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Not found" });
  if (String(student.user) !== String(req.user._id) && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  student.docs.push(...req.files.map(f => ({
    filename: f.filename, originalname: f.originalname, mimetype: f.mimetype, size: f.size
  })));
  await student.save();
  res.json(student);
});

// List/search (admin)
router.get("/", auth, permit("admin"), async (req, res) => {
  const { course, status, year, q } = req.query;
  const filter = {};
  if (course) filter.course = course;
  if (status) filter.status = status;
  if (year) filter.year = Number(year);
  if (q) {
    filter.$or = [
      { firstName: new RegExp(q, "i") },
      { lastName: new RegExp(q, "i") },
      { email: new RegExp(q, "i") }
    ];
  }
  const list = await Student.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json(list);
});

// Get my registration (student) or by id (admin)
router.get("/me", auth, async (req, res) => {
  const s = await Student.findOne({ user: req.user._id });
  res.json(s || null);
});

router.get("/:id", auth, async (req, res) => {
  const s = await Student.findById(req.params.id);
  if (!s) return res.status(404).json({ message: "Not found" });
  if (req.user.role !== "admin" && String(s.user) !== String(req.user._id))
    return res.status(403).json({ message: "Forbidden" });
  res.json(s);
});

// Update status (admin)
router.patch("/:id/status", auth, permit("admin"), async (req, res) => {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  const s = await Student.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!s) return res.status(404).json({ message: "Not found" });
  await sendMail({ to: s.email, subject: `Application ${status}`,
    html: `<p>Your application has been <b>${status}</b>.</p>` });
  await sendSMS(s.phone, f"Your application has been {status}.");
  res.json(s);
});

// Update/delete (admin)
router.patch("/:id", auth, permit("admin"), async (req, res) => {
  const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!s) return res.status(404).json({ message: "Not found" });
  res.json(s);
});

router.delete("/:id", auth, permit("admin"), async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
