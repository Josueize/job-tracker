import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5001/api/ai";

const categoryColors = {
  Technical: { color: "#4f6ef7", bg: "rgba(79,110,247,0.12)" },
  Behavioral: { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  Situational: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

export default function InterviewPrep({ job, token, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/interview-prep`,
        { company: job.company, role: job.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(res.data.questions || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)", padding: 20 }}>
      <div style={{ background: "#111118", border: "1px solid #2d2d4e", borderRadius: 20, padding: 32, width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>🎯 Interview Prep</h2>
          <button onClick={onClose} style={{ background: "#1e1e2e", border: "none", color: "#a0aec0", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Close</button>
        </div>

        <p style={{ color: "#555570", fontSize: 14, marginBottom: 24 }}>
          AI-generated questions for <strong style={{ color: "#e2e8f0" }}>{job.role}</strong> at <strong style={{ color: "#e2e8f0" }}>{job.company}</strong>
        </p>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#ef4444", fontSize: 14 }}>
            {error}
          </div>
        )}

        {!questions.length && !loading && (
          <button onClick={generate}
            style={{ width: "100%", background: "linear-gradient(135deg, #4f6ef7, #7c3aed)", color: "#fff", border: "none", padding: "14px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
            ✨ Generate Interview Questions
          </button>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #1e1e2e", borderTopColor: "#4f6ef7", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#555570", fontSize: 14 }}>AI is preparing your questions...</p>
          </div>
        )}

        {questions.length > 0 && (
          <>
            <div style={{ marginBottom: 16 }}>
              {questions.map((q, i) => {
                const cat = categoryColors[q.category] || categoryColors.Behavioral;
                return (
                  <div key={i} style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
                    <div onClick={() => setExpanded(expanded === i ? null : i)}
                      style={{ padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Q{i + 1}.</span>
                        <span style={{ fontSize: 14, color: "#e2e8f0", flex: 1 }}>{q.question}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: cat.color, background: cat.bg, padding: "3px 10px", borderRadius: 20 }}>{q.category}</span>
                        <span style={{ color: "#555570", fontSize: 12 }}>{expanded === i ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    {expanded === i && (
                      <div style={{ padding: "0 16px 14px", borderTop: "1px solid #1e1e2e" }}>
                        <div style={{ marginTop: 12, background: "rgba(79,110,247,0.08)", border: "1px solid rgba(79,110,247,0.2)", borderRadius: 8, padding: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#4f6ef7", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>💡 Tip</div>
                          <div style={{ fontSize: 13, color: "#a0aec0", lineHeight: 1.6 }}>{q.tip}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={generate}
              style={{ width: "100%", background: "#1e1e2e", color: "#a0aec0", border: "none", padding: "12px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
              🔄 Regenerate Questions
            </button>
          </>
        )}
      </div>
    </div>
  );
}