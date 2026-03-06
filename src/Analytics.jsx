import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#60a5fa", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

export default function Analytics({ jobs, onClose }) {
  const statusData = [
    { name: "Applied", value: jobs.filter(j => j.status === "Applied").length },
    { name: "Interview", value: jobs.filter(j => j.status === "Interview").length },
    { name: "Offer", value: jobs.filter(j => j.status === "Offer").length },
    { name: "Rejected", value: jobs.filter(j => j.status === "Rejected").length },
    { name: "Ghosted", value: jobs.filter(j => j.status === "Ghosted").length },
  ].filter(d => d.value > 0);

  const monthlyData = jobs.reduce((acc, job) => {
    if (!job.date) return acc;
    const month = new Date(job.date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const existing = acc.find(d => d.month === month);
    if (existing) existing.count++;
    else acc.push({ month, count: 1 });
    return acc;
  }, []).sort((a, b) => new Date(a.month) - new Date(b.month));

  const responseRate = jobs.length
    ? Math.round((jobs.filter(j => j.status !== "Applied" && j.status !== "Ghosted").length / jobs.length) * 100)
    : 0;

  const offerRate = jobs.length
    ? Math.round((jobs.filter(j => j.status === "Offer").length / jobs.length) * 100)
    : 0;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)", padding: 20 }}>
      <div style={{ background: "#111118", border: "1px solid #2d2d4e", borderRadius: 20, padding: 32, width: "100%", maxWidth: 800, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>📊 Analytics</h2>
          <button onClick={onClose} style={{ background: "#1e1e2e", border: "none", color: "#a0aec0", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Close</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Total Applications", value: jobs.length, color: "#4f6ef7" },
            { label: "Response Rate", value: `${responseRate}%`, color: "#f59e0b" },
            { label: "Offer Rate", value: `${offerRate}%`, color: "#10b981" },
            { label: "Interviews", value: jobs.filter(j => j.status === "Interview").length, color: "#8b5cf6" },
          ].map(s => (
            <div key={s.label} style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#555570", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Status Breakdown</h3>
            {statusData.length === 0 ? (
              <div style={{ textAlign: "center", color: "#555570", padding: 40 }}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {statusData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#111118", border: "1px solid #2d2d4e", borderRadius: 8, color: "#e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Applications Over Time</h3>
            {monthlyData.length === 0 ? (
              <div style={{ textAlign: "center", color: "#555570", padding: 40 }}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#555570" fontSize={11} />
                  <YAxis stroke="#555570" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#111118", border: "1px solid #2d2d4e", borderRadius: 8, color: "#e2e8f0" }} />
                  <Bar dataKey="count" fill="#4f6ef7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}