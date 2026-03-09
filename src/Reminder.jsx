import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5001/api/reminders";

export default function Reminder({ job, token, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${API}/remind`, { jobId: job.id, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#111118", border: "1px solid #2d2d4e", borderRadius: 20, padding: 32, width: "90%", maxWidth: 420 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>🔔 Send Reminder</h2>
        <p style={{ color: "#555570", fontSize: 14, marginBottom: 24 }}>
          Send a follow-up reminder for <strong style={{ color: "#e2e8f0" }}>{job.role}</strong> at <strong style={{ color: "#e2e8f0" }}>{job.company}</strong>
        </p>
        {success ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ color: "#10b981", fontWeight: 600, fontSize: 16 }}>Reminder sent successfully!</div>
            <button onClick={onClose} style={{ marginTop: 20, background: "#1e1e2e", border: "none", color: "#a0aec0", padding: "10px 24px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>Close</button>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#ef4444", fontSize: 14 }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#555570", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Send reminder to</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ background: "#0d0d14", border: "1px solid #1e1e2e", color: "#e2e8f0", borderRadius: 10, padding: "12px 14px", width: "100%", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleSend} disabled={loading}
                style={{ flex: 1, background: "linear-gradient(135deg, #4f6ef7, #7c3aed)", color: "#fff", border: "none", padding: "13px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                {loading ? "Sending..." : "Send Reminder 📧"}
              </button>
              <button onClick={onClose}
                style={{ background: "#1e1e2e", border: "none", color: "#a0aec0", padding: "13px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}