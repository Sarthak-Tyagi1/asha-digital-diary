const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Create app FIRST
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const ashaRoutes = require("./routes/ashaRoutes");
app.use("/api/asha", ashaRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 ASHA Tracker API Running");
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`🔥 Server running on port ${process.env.PORT}`);
});


const visitRoutes = require("./routes/visitRoutes");
app.use("/api/visit", visitRoutes);
