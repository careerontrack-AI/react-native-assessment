import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "http://localhost";

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from "./routes/auth.js";
import goalRoutes from "./routes/goals.js";
import userRoutes from "./routes/users.js";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CareerOnTrack API is running" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📱 API ready for mobile app integration`);
});
