import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import jwt from "jsonwebtoken";

import { connectDB } from "./config/db.js";
import User from "./models/User.js";

import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";
import reportRoutes from "./routes/reports.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*", credentials: true }));
app.use(rateLimit({ windowMs: 60 * 1000, limit: 120 }));

app.get("/", (req, res) => res.send("Student Registration API"));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB(process.env.MONGO_URI);

  // optional seed admin
  if (process.env.SEED_ADMIN === "true") {
    const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!exists) {
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin"
      });
      console.log("👑 Admin user seeded");
    }
  }

  app.listen(PORT, () => console.log(`🚀 Server running on :${PORT}`));
};

start().catch(err => {
  console.error(err);
  process.exit(1);
});
