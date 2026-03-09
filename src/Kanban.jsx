import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5001/api/jobs";

const columns = [
  { id: "Applied", label: "📤 Applied", color: "#60a5fa" },
  { id: "Interview", label: "🎯 Interview", color: "#f59e0b" },
  { id: "Offer", label: "🏆 Offer", color: "#10b981" },
  { id: "Rejected", label: "❌ Rejected", color: "#ef4444" },
  { id: "Ghosted", label: "👻 Ghosted", color: "#8b5cf6" },
];

export default function Kanban({ jobs, token, onClose, onUpdate }) {
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (job) => setDragging(job);

  const handleDrop = async (status) => {
    if (!dragging || dragging.status === status) return;
    try {
      await axios.put(`${API}/${dragging.id}`,
        { ...dragging, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate();
    } catch (err) {
      console.error(err);
    }
    setDragging(null);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, backdropFilter: "blur(4px)", overflowY: "auto", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff" }}>📋 Kanban Board</h2>
          <button onClick={onClose} style={{ background: "#1e1e2e", border: "none", color: "#a0aec0", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
            Close
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {columns.map(col => (
            <div key={col.id}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}
              style={{ background: "#111118", border: `1px solid ${col.color}33`, borderRadius: 16, padding: 16, minHeight: 400 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                <span style={{ color: col.color, fontWeight: 700, fontSize: 13 }}>{col.label}</span>
                <span style={{ marginLeft: "auto", background: `${col.color}22`, color: col.color, borderRadius: 20, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>
                  {jobs.filter(j => j.status === col.id).length}
                </span>
              </div>

              {jobs.filter(j => j.status === col.id).map(job => (
                <div key={job.id}
                  draggable
                  onDragStart={() => handleDragStart(job)}
                  style={{
                    background: "#0d0d14",
                    border: "1px solid #1e1e2e",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 10,
                    cursor: "grab",
                    transition: "all 0.2s",
                    opacity: dragging?.id === job.id ? 0.5 : 1,
                  }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#e2e8f0", marginBottom: 4 }}>{job.company}</div>
                  <div style={{ fontSize: 12, color: "#a0aec0", marginBottom: 8 }}>{job.role}</div>
                  {job.date && (
                    <div style={{ fontSize: 11, color: "#555570" }}>
                      {new Date(job.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  )}
                </div>
              ))}

              {jobs.filter(j => j.status === col.id).length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#555570", fontSize: 13 }}>
                  Drop here
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}