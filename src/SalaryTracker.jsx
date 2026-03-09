import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#4f6ef7", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function SalaryTracker({ jobs, onClose }) {
  const jobsWithSalary = jobs.filter(j => j.salary && j.salary > 0);
  const avgSalary = jobsWithSalary.length
    ? Math.round(jobsWithSalary.reduce((sum, j) => sum + j.salary, 0) / jobsWithSalary.length)
    : 0;
  const maxSalary = jobsWithSalary.length ? Math.max(...jobsWithSalary.map(j => j.salary)) : 0;
  const minSalary = jobsWithSalary.length ? Math.min(...jobsWithSalary.map(j => j.salary)) : 0;

  const chartData = jobsWithSalary.map(j => ({
    name: j.company,
    salary: j.salary,
    role: j.role,
  }));

  const formatSalary = (val) => `$${val.toLocaleString()}`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)", padding: 20 }}>
      <div style={{ background: "#111118", border: "1px solid #2d2d4e", borderRadius: 20, padding: 32, width: "100%", maxWidth: 800, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>💰 Salary Tracker</h2>
          <button onClick={onClose} style={{ background: "#1e1e2e", border: "none", color: "#a0aec0", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Close</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Average Salary", value: formatSalary(avgSalary), color: "#4f6ef7" },
            { label: "Highest Offer", value: formatSalary(maxSalary), color: "#10b981" },
            { label: "Lowest Offer", value: formatSalary(minSalary), color: "#f59e0b" },
            { label: "Jobs with Salary", value: jobsWithSalary.length, color: "#8b5cf6" },
          ].map(s => (
            <div key={s.label} style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#555570", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {chartData.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#555570" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>No salary data yet</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Add expected salary when creating job applications</div>
          </div>
        ) : (
          <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Salary Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#555570" fontSize={11} />
                <YAxis stroke="#555570" fontSize={11} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#111118", border: "1px solid #2d2d4e", borderRadius: 8, color: "#e2e8f0" }}
                  formatter={(value) => [formatSalary(value), "Salary"]}
                />
                <Bar dataKey="salary" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>All Salaries</h3>
          {jobsWithSalary.length === 0 ? (
            <div style={{ color: "#555570", fontSize: 13 }}>No salary data available</div>
          ) : (
            jobsWithSalary.sort((a, b) => b.salary - a.salary).map(job => (
              <div key={job.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 10, marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14 }}>{job.company}</div>
                  <div style={{ fontSize: 12, color: "#555570" }}>{job.role}</div>
                </div>
                <div style={{ fontWeight: 700, color: "#10b981", fontSize: 16 }}>{formatSalary(job.salary)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}