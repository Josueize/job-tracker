import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5001/api/ai";

export default function CoverLetter({ job, token, onClose }) {
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/cover-letter`,
        { company: job.company, role: job.role, notes: job.notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLetter(res.data.letter);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)", padding: 20 }}>
      <div style={{ background: "#111118", border: "1px solid #2d2d4e", borderRadius: 20, padding: 32, width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>🤖 AI Cover Letter</h2>
          <button onClick={onClose} style={{ background: "#1e1e2e", border: "none", color: "#a0aec0", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Close</button>
        </div>

        <p style={{ color: "#555570", fontSize: 14, marginBottom: 24 }}>
          Generating cover letter for <strong style={{ color: "#e2e8f0" }}>{job.role}</strong> at <strong style={{ color: "#e2e8f0" }}>{job.company}</strong>
        </p>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#ef4444", fontSize: 14 }}>
            {error}
          </div>
        )}

        {!letter && !loading && (
          <button onClick={generate}
            style={{ width: "100%", background: "linear-gradient(135deg, #4f6ef7, #7c3aed)", color: "#fff", border: "none", padding: "14px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
            ✨ Generate Cover Letter
          </button>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #1e1e2e", borderTopColor: "#4f6ef7", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#555570", fontSize: 14 }}>AI is writing your cover letter...</p>
          </div>
        )}

        {letter && (
          <>
            <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 24, marginBottom: 16, whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.8, color: "#e2e8f0" }}>
              {letter}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleCopy}
                style={{ flex: 1, background: copied ? "rgba(16,185,129,0.15)" : "rgba(79,110,247,0.15)", color: copied ? "#10b981" : "#4f6ef7", border: `1px solid ${copied ? "#10b981" : "#4f6ef7"}`, padding: "12px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
              </button>
              <button onClick={generate}
                style={{ background: "#1e1e2e", color: "#a0aec0", border: "none", padding: "12px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                🔄 Regenerate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}