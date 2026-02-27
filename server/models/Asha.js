const mongoose = require("mongoose");

const ashaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    village: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asha", ashaSchema);
