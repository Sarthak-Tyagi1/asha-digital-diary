const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    ashaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asha",
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    startLocation: {
      lat: Number,
      lng: Number,
    },
    endLocation: {
      lat: Number,
      lng: Number,
    },
    duration: {
      type: Number, // in minutes
    },
    distance: {
      type: Number,
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Visit", visitSchema);
