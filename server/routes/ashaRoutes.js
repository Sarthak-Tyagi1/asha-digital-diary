const express = require("express");
const router = express.Router();
const Asha = require("../models/Asha");

// Register ASHA
router.post("/register", async (req, res) => {
  try {
    const { name, phone, village, pin } = req.body;

    const existing = await Asha.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const newAsha = new Asha({ name, phone, village, pin });
    await newAsha.save();

    res.status(201).json({
      message: "ASHA Registered Successfully",
      data: newAsha,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;


// Login ASHA
router.post("/login", async (req, res) => {
  try {
    const { phone, pin } = req.body;

    const asha = await Asha.findOne({ phone });

    if (!asha) {
      return res.status(404).json({ message: "ASHA not found" });
    }

    if (asha.pin !== pin) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    res.status(200).json({
      message: "Login successful",
      data: asha
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});
