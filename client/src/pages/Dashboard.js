import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Pregnancy from "../assets/Pregnancy.png";

function Dashboard() {
  const navigate = useNavigate();
  const asha = JSON.parse(localStorage.getItem("asha"));

  const [visitId, setVisitId] = useState(null);
  const [activity, setActivity] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const activities = [
    "Pregnancy Check",
    "Vaccination",
    "Awareness Visit",
    "Medicine Distribution"
  ];

  // Timer effect
  useEffect(() => {
    let interval;

    if (visitId && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [visitId, startTime]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return (
      String(hrs).padStart(2, "0") + ":" +
      String(mins).padStart(2, "0") + ":" +
      String(secs).padStart(2, "0")
    );
  };

  const startVisit = async () => {
    if (!activity) {
      alert("Please select an activity first");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const res = await API.post("/visit/start", {
        ashaId: asha._id,
        activity,
        lat: latitude,
        lng: longitude,
      });

      setVisitId(res.data.visitId);
      setStartTime(new Date());
      alert("Visit Started for " + activity);
    });
  };

  const endVisit = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const res = await API.post("/visit/end", {
        visitId,
        lat: latitude,
        lng: longitude,
      });

      alert(
        "Visit Ended\nDuration: " +
          res.data.duration +
          "\nDistance: " +
          res.data.distance
      );

      setVisitId(null);
      setActivity("");
      setStartTime(null);
      setElapsedTime(0);
    });
  };

  return (
    <div className="container">
      <div className="card">

        <h1
          style={{
            textAlign: "center",
            marginBottom: "15px",
            color: "#0d9488",
            fontSize: "22px"
          }}
        >
          ASHA Digital Diary
        </h1>

        <img
          src={Pregnancy}
          alt="Visit"
          className="login-image"
        />

        <h2>
          Welcome {asha.name}
        </h2>

        <div
          className={`status-badge ${
            visitId ? "status-active" : "status-inactive"
          }`}
        >
          {visitId ? "🔴 Visit Active" : "🟢 No Active Visit"}
        </div>

        {/* Live Timer */}
        {visitId && (
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            ⏱ Visit Running: {formatTime(elapsedTime)}
          </div>
        )}

        <h3>Select Activity</h3>

        {activities.map((item) => (
          <div key={item} style={{ marginBottom: "8px" }}>
            <button
              className={`activity-btn ${
                activity === item ? "activity-selected" : ""
              }`}
              onClick={() => setActivity(item)}
            >
              {item}
            </button>
          </div>
        ))}

        <br />

        <button onClick={startVisit} disabled={visitId}>
          Start Visit
        </button>

        <br /><br />

        <button onClick={endVisit} disabled={!visitId}>
          End Visit
        </button>

        <br /><br />

        <button onClick={() => navigate(`/report/${asha._id}`)}>
          View Report
        </button>

      </div>
    </div>
  );
}

export default Dashboard;
