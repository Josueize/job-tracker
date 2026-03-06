import { useState } from "react";
import JobTracker from "./JobTracker";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [email, setEmail] = useState(localStorage.getItem("email") || null);
  const [page, setPage] = useState("login");

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

  if (token) {
    return <JobTracker token={token} email={email} onLogout={handleLogout} />;
  }

  if (page === "register") {
    return <Register onLogin={handleLogin} switchToLogin={() => setPage("login")} />;
  }

  return <Login onLogin={handleLogin} switchToRegister={() => setPage("register")} />;
}