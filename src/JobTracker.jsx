import { useState, useEffect } from "react";
import axios from "axios";
import Analytics from "./Analytics";
import exportToPDF from "./ExportPDF";
import Reminder from "./Reminder";
import Kanban from "./Kanban";
import SalaryTracker from "./SalaryTracker";
import CoverLetter from "./CoverLetter";
import InterviewPrep from "./InterviewPrep";

const API = "http://localhost:5001/api/jobs";

const statusConfig = {
  Applied: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", icon: "📤" },
  Interview: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "🎯" },
  Offer: { color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "🏆" },
  Rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", icon: "❌" },
  Ghosted: { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", icon: "👻" },
};

const emptyForm = { company: "", role: "", status: "Applied", date: "", link: "", notes: "", salary: "" };

export default function JobTracker({ token, email, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showKanban, setShowKanban] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [reminderJob, setReminderJob] = useState(null);
  const [coverLetterJob, setCoverLetterJob] = useState(null);
  const [interviewJob, setInterviewJob] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
        setJobs(res.data);
      } catch (err) {
        setToast({ msg: "Failed to load jobs", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    getJobs();
  }, [token]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(API, { headers });
      setJobs(res.data);
    } catch (err) {
      showToast("Failed to load jobs", "error");
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = jobs
    .filter(j => filter === "All" || j.status === filter)
    .filter(j =>
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortBy === "date" ? new Date(b.date) - new Date(a.date) : a.company.localeCompare(b.company));

  const stats = Object.keys(statusConfig).map(s => ({
    label: s,
    count: jobs.filter(j => j.status === s).length,
    ...statusConfig[s],
  }));

  const handleSubmit = async () => {
    if (!form.company || !form.role || !form.date) {
      showToast("Fill in required fields!", "error");
      return;
    }
    try {
      if (editId !== null) {
        await axios.put(`${API}/${editId}`, form, { headers });
        showToast("Application updated");
      } else {
        await axios.post(API, form, { headers });
        showToast("Application added");
      }
      fetchJobs();
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      showToast("Something went wrong", "error");
    }
  };

  const handleEdit = (job) => {
    setForm({
      company: job.company,
      role: job.role,
      status: job.status,
      date: job.date ? job.date.split("T")[0] : "",
      link: job.link || "",
      notes: job.notes || "",
      salary: job.salary || ""
    });
    setEditId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, { headers });
      showToast("Removed", "error");
      fetchJobs();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const responseRate = jobs.length
    ? Math.round((jobs.filter(j => j.status !== "Applied" && j.status !== "Ghosted").length / jobs.length) * 100)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select { outline: none; font-family: inherit; }
        .btn { border: none; cursor: pointer; font-family: inherit; font-weight: 600; border-radius: 10px; transition: all 0.2s; }
        .btn:hover { transform: translateY(-1px); }
        .stat-card { background: #111118; border: 1px solid #1e1e2e; border-radius: 14px; padding: 18px 22px; transition: all 0.2s; cursor: pointer; }
        .stat-card:hover { transform: translateY(-2px); }
        .form-input { background: #0d0d14; border: 1px solid #1e1e2e; color: #e2e8f0; border-radius: 10px; padding: 10px 14px; width: 100%; font-size: 14px; transition: border-color 0.2s; }
        .form-input:focus { border-color: #4f6ef7; }
        .job-row { display: grid; grid-template-columns: 1.5fr 1.5fr 120px 100px auto; gap: 16px; align-items: center; padding: 16px 20px; border-bottom: 1px solid #1a1a24; transition: background 0.15s; }
        .job-row:hover { background: #13131c; }
        .tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .toast { position: fixed; bottom: 32px; right: 32px; padding: 14px 22px; border-radius: 12px; font-weight: 600; font-size: 14px; z-index: 999; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
        .modal { background: #111118; border: 1px solid #2d2d4e; border-radius: 20px; padding: 32px; width: 90%; max-width: 520px; }
        .progress-bar { height: 6px; background: #1e1e2e; border-radius: 3px; overflow: hidden; margin-top: 8px; }
        .progress-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
        .spinner { width: 40px; height: 40px; border: 3px solid #1e1e2e; border-top-color: #4f6ef7; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 60px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .job-row { grid-template-columns: 1fr; gap: 8px; } }
      `}</style>

      <div style={{ padding: "32px 40px 0", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg, #fff 40%, #4f6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>
              JobTrackr
            </h1>
            <p style={{ color: "#555570", fontSize: 14, marginTop: 4 }}>👋 Welcome, {email}</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn" onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
              style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)", color: "#fff", padding: "12px 24px", fontSize: 14 }}>
              + New Application
            </button>
            <button className="btn" onClick={() => setShowAnalytics(true)}
              style={{ background: "#1e1e2e", color: "#a0aec0", padding: "12px 24px", fontSize: 14 }}>
              📊 Analytics
            </button>
            <button className="btn" onClick={() => setShowKanban(true)}
              style={{ background: "#1e1e2e", color: "#a0aec0", padding: "12px 24px", fontSize: 14 }}>
              📋 Kanban
            </button>
            <button className="btn" onClick={() => setShowSalary(true)}
              style={{ background: "#1e1e2e", color: "#a0aec0", padding: "12px 24px", fontSize: 14 }}>
              💰 Salary
            </button>
            <button className="btn" onClick={() => exportToPDF(jobs, email)}
              style={{ background: "#1e1e2e", color: "#a0aec0", padding: "12px 24px", fontSize: 14 }}>
              📄 Export PDF
            </button>
            <button className="btn" onClick={onLogout}
              style={{ background: "#1e1e2e", color: "#a0aec0", padding: "12px 24px", fontSize: 14 }}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 32 }}>
          <div className="stat-card" style={{ borderColor: filter === "All" ? "#4f6ef7" : "" }} onClick={() => setFilter("All")}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{jobs.length}</div>
            <div style={{ fontSize: 12, color: "#555570", marginTop: 2 }}>Total</div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: "100%", background: "#4f6ef7" }} /></div>
          </div>
          {stats.map(s => (
            <div key={s.label} className="stat-card" style={{ borderColor: filter === s.label ? s.color : "" }}
              onClick={() => setFilter(filter === s.label ? "All" : s.label)}>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 12, color: "#555570", marginTop: 2 }}>{s.icon} {s.label}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: jobs.length ? `${(s.count / jobs.length) * 100}%` : "0%", background: s.color }} />
              </div>
            </div>
          ))}
          <div className="stat-card">
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: "#10b981" }}>{responseRate}%</div>
            <div style={{ fontSize: 12, color: "#555570", marginTop: 2 }}>Response Rate</div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${responseRate}%`, background: "#10b981" }} /></div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input className="form-input" placeholder="Search company or role..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <select className="form-input" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 160 }}>
            <option value="date">Sort: Latest</option>
            <option value="company">Sort: Company</option>
          </select>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 40px" }}>
        <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 16, overflow: "hidden" }}>
          <div className="job-row" style={{ background: "#0d0d14", borderBottom: "1px solid #1e1e2e" }}>
            {["Company", "Role", "Status", "Date", "Actions"].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#555570", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
            ))}
          </div>
          {loading ? (
            <div className="spinner" />
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#555570" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <div style={{ fontWeight: 600 }}>No applications yet</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Click "+ New Application" to get started</div>
            </div>
          ) : (
            filtered.map(job => {
              const s = statusConfig[job.status] || statusConfig.Applied;
              return (
                <div key={job.id} className="job-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{job.company}</div>
                    {job.link && <a href={job.link} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#4f6ef7", textDecoration: "none" }}>View listing</a>}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, color: "#a0aec0" }}>{job.role}</div>
                    {job.notes && <div style={{ fontSize: 11, color: "#555570", marginTop: 2 }}>{job.notes}</div>}
                  </div>
                  <div>
                    <span className="tag" style={{ color: s.color, background: s.bg }}>{s.icon} {job.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#555570" }}>
                    {job.date ? new Date(job.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button className="btn" onClick={() => handleEdit(job)}
                      style={{ background: "#1e1e2e", color: "#a0aec0", padding: "6px 12px", fontSize: 12 }}>Edit</button>
                    <button className="btn" onClick={() => setCoverLetterJob(job)}
                      style={{ background: "rgba(79,110,247,0.1)", color: "#4f6ef7", padding: "6px 12px", fontSize: 12 }}>✉️</button>
                    <button className="btn" onClick={() => setInterviewJob(job)}
                      style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "6px 12px", fontSize: 12 }}>🎯</button>
                    <button className="btn" onClick={() => setReminderJob(job)}
                      style={{ background: "rgba(79,110,247,0.1)", color: "#4f6ef7", padding: "6px 12px", fontSize: 12 }}>🔔</button>
                    <button className="btn" onClick={() => handleDelete(job.id)}
                      style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "6px 12px", fontSize: 12 }}>Del</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {filtered.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#555570" }}>
            Showing {filtered.length} of {jobs.length} applications
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
              {editId !== null ? "Edit Application" : "New Application"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Company *", key: "company", placeholder: "e.g. Stripe" },
                { label: "Role *", key: "role", placeholder: "e.g. Frontend Engineer" },
                { label: "Job Link", key: "link", placeholder: "https://..." },
                { label: "Date Applied *", key: "date", type: "date" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#555570", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input className="form-input" type={f.type || "text"} placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#555570", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Status</label>
                <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {Object.keys(statusConfig).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#555570", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Notes</label>
                <input className="form-input" placeholder="Any notes..." value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#555570", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Expected Salary ($)</label>
                <input className="form-input" type="number" placeholder="e.g. 85000"
                  value={form.salary || ""} onChange={e => setForm({ ...form, salary: e.target.value })} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button className="btn" onClick={handleSubmit}
                style={{ flex: 1, background: "linear-gradient(135deg, #4f6ef7, #7c3aed)", color: "#fff", padding: "13px", fontSize: 14 }}>
                {editId !== null ? "Save Changes" : "Add Application"}
              </button>
              <button className="btn" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}
                style={{ background: "#1e1e2e", color: "#a0aec0", padding: "13px 20px", fontSize: 14 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalytics && <Analytics jobs={jobs} onClose={() => setShowAnalytics(false)} />}
      {showKanban && <Kanban jobs={jobs} token={token} onClose={() => setShowKanban(false)} onUpdate={fetchJobs} />}
      {showSalary && <SalaryTracker jobs={jobs} onClose={() => setShowSalary(false)} />}
      {coverLetterJob && <CoverLetter job={coverLetterJob} token={token} onClose={() => setCoverLetterJob(null)} />}
      {interviewJob && <InterviewPrep job={interviewJob} token={token} onClose={() => setInterviewJob(null)} />}
      {reminderJob && <Reminder job={reminderJob} token={token} onClose={() => setReminderJob(null)} />}

      {toast && (
        <div className="toast" style={{
          background: toast.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
          color: toast.type === "error" ? "#ef4444" : "#10b981",
          border: `1px solid ${toast.type === "error" ? "#ef4444" : "#10b981"}`
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}