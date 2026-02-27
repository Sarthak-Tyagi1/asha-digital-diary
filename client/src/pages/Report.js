import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function Report() {
  const { ashaId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const res = await API.get(`/visit/report/${ashaId}`);
      setReport(res.data);
    };

    fetchReport();
  }, [ashaId]);

  if (!report) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Daily Report</h2>
      <p>Total Visits: {report.totalVisits}</p>
      <p>Total Working Hours: {report.totalWorkingHours}</p>
      <p>Total Distance: {report.totalDistance} km</p>
      <p>Total Incentive: ₹{report.totalIncentive}</p>
    </div>
  );
}

export default Report;
