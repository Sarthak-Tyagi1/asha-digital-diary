const express = require("express");
const router = express.Router();
const Visit = require("../models/Visit");

// =============================
// START VISIT
// =============================
router.post("/start", async (req, res) => {
  try {
    const { ashaId, activity, lat, lng } = req.body;

    const visit = new Visit({
      ashaId,
      activity,
      startTime: new Date(),
      startLocation: { lat, lng },
    });

    await visit.save();

    res.status(201).json({
      message: "Visit started",
      visitId: visit._id,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// =============================
// HAVERSINE DISTANCE FUNCTION
// =============================
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// =============================
// END VISIT
// =============================
router.post("/end", async (req, res) => {
  try {
    const { visitId, lat, lng } = req.body;

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    visit.endTime = new Date();
    visit.endLocation = { lat, lng };

    // Duration calculation
    const durationMs = visit.endTime - visit.startTime;
    visit.duration = Math.round(durationMs / 60000);

    // Distance calculation
    const distance = calculateDistance(
      visit.startLocation.lat,
      visit.startLocation.lng,
      lat,
      lng
    );

    visit.distance = Number(distance.toFixed(2));

    await visit.save();

    res.status(200).json({
      message: "Visit ended",
      duration: visit.duration + " minutes",
      distance: visit.distance + " km",
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// =============================
// DAILY REPORT
// =============================
router.get("/report/:ashaId", async (req, res) => {
  try {
    const { ashaId } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const visits = await Visit.find({
      ashaId,
      startTime: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalVisits = visits.length;

    const totalDuration = visits.reduce((sum, visit) => {
      return sum + (visit.duration || 0);
    }, 0);

    const totalHours = totalDuration / 60;

    const totalDistance = visits.reduce((sum, visit) => {
      return sum + (visit.distance || 0);
    }, 0);

    const incentive =
      (totalVisits * 50) +
      (totalHours * 10) +
      (totalDistance * 5);

    res.status(200).json({
      totalVisits,
      totalWorkingMinutes: totalDuration,
      totalWorkingHours: totalHours.toFixed(2),
      totalDistance: totalDistance.toFixed(2),
      totalIncentive: Math.round(incentive),
      visits
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// =============================
// EXPORT ROUTER (IMPORTANT)
// =============================
module.exports = router;
