import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", 
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1 }),
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });
  const user = await User.create({ name, email, password, role: "student" });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

router.post("/login",
  body("email").isEmail(),
  body("password").notEmpty(),
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export default router;
