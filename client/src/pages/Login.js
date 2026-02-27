import Community from "../assets/Community.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/asha/login", { phone, pin });

      const asha = res.data.data;

      localStorage.setItem("asha", JSON.stringify(asha));

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

 return (
  <div className="container">
    <div className="card" style={{ textAlign: "center" }}>
      
      <img 
        src={Community} 
        alt="Community" 
        style={{ width: "100%", borderRadius: "12px", marginBottom: "15px" }} 
      />

      <h2>ASHA Digital Diary</h2>

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="PIN"
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  </div>
);
}

export default Login;
