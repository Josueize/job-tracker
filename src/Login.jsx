import { useState } from "react";
import axios from "axios";
import { useTheme } from "./ThemeContext";

const AUTH_URL = "http://localhost:5001/api/auth";

export default function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { bg, surface, border, text, textMuted, inputBg } = useTheme();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${AUTH_URL}/login`, { email, password });
      onLogin(res.data.token, res.data.email);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .form-input { background: ${inputBg}; border: 1px solid ${border}; color: ${text}; border-radius: 10px; padding: 12px 14px; width: 100%; font-size: 14px; outline: none; transition: border-color 0.2s; font-family: inherit; }
        .form-input:focus { border-color: #4f6ef7; }
        .btn { border: none; cursor: pointer; font-family: inherit; font-weight: 600; border-radius: 10px; transition: all 0.2s; }
        .btn:hover { transform: translateY(-1px); }
      `}</style>
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, padding: 40, width: "90%", maxWidth: 420 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #4f6ef7 40%, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>
          Welcome back
        </h1>
        <p style={{ color: textMuted, fontSize: 14, marginBottom: 32 }}>Login to your JobTrackr account</p>
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 10, padding: "10px 14px", marginBottom: 20, color: "#ef4444", fontSize: 14 }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Email</label>
          <input className="form-input" type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Password</label>
          <input className="form-input" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <button className="btn" onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", background: "linear-gradient(135deg, #4f6ef7, #7c3aed)", color: "#fff", padding: "13px", fontSize: 14, marginBottom: 16 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={{ textAlign: "center", fontSize: 14, color: textMuted }}>
          Don't have an account?{" "}
          <span onClick={switchToRegister} style={{ color: "#4f6ef7", cursor: "pointer", fontWeight: 600 }}>Register</span>
        </p>
      </div>
    </div>
  );
}