import { useState } from "react";
import JobTracker from "./JobTracker";
import Login from "./Login";
import Register from "./Register";
import { useTheme } from "./ThemeContext";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [email, setEmail] = useState(localStorage.getItem("email") || null);
  const [page, setPage] = useState("login");
  const { dark, toggleTheme } = useTheme();

  const handleLogin = (token, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setToken(token);
    setEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken(null);
    setEmail(null);
    setPage("login");
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggleTheme}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 9999,
          background: dark ? "#1e1e2e" : "#e2e8f0",
          border: "none",
          borderRadius: 10,
          padding: "8px 14px",
          cursor: "pointer",
          fontSize: 18,
        }}
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {token ? (
        <JobTracker token={token} email={email} onLogout={handleLogout} />
      ) : page === "register" ? (
        <Register onLogin={handleLogin} switchToLogin={() => setPage("login")} />
      ) : (
        <Login onLogin={handleLogin} switchToRegister={() => setPage("register")} />
      )}
    </div>
  );
}