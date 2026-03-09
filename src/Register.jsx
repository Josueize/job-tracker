import { useState } from "react";
import axios from "axios";

const AUTH_URL = "http://localhost:5001/api/auth";

export default function Register({ onLogin, switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || !confirm) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${AUTH_URL}/register`, { email, password });
      onLogin(res.data.token, res.data.email);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .form-input { background: #0d0d14; border: 1px solid #1e1e2e; color: #e2e8f0; border-radius: 10px; padding: 12px 14px; width: 100%; font-size: 14px; outline: none; transition: border-color 0.2s; font-family: inherit; }
        .form-input:focus { border-color: #4f6ef7; }
        .btn { border: none; cursor: pointer; font-family: inherit; font-weight: 600; border-radius: 10px; transition: all 0.2s; }
        .btn:hover { transform: translateY(-1px); }
      `}</style>
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 20, padding: 40, width: "90%", maxWidth: 420 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #fff 40%, #4f6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>
          Create account
        </h1>
        <p style={{ color: "#555570", fontSize: 14, marginBottom: 32 }}>Start tracking your job applications</p>
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 10, padding: "10px 14px", marginBottom: 20, color: "#ef4444", fontSize: 14 }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#555570", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Email</label>
          <input className="form-input" type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#555570", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Password</label>
          <input className="form-input" type="password" placeholder="Min 6 characters"
            value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#555570", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Confirm Password</label>
          <input className="form-input" type="password" placeholder="Repeat password"
            value={confirm} onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <button className="btn" onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", background: "linear-gradient(135deg, #4f6ef7, #7c3aed)", color: "#fff", padding: "13px", fontSize: 14, marginBottom: 16 }}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p style={{ textAlign: "center", fontSize: 14, color: "#555570" }}>
          Already have an account?{" "}
          <span onClick={switchToLogin} style={{ color: "#4f6ef7", cursor: "pointer", fontWeight: 600 }}>Login</span>
        </p>
      </div>
    </div>
  );
}