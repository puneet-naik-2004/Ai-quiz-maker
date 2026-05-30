import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      background: "#fff",
      borderBottom: "1px solid var(--border)",
      padding: "0 1.5rem",
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/dashboard" style={{ fontWeight: 700, fontSize: 18, color: "var(--primary)" }}>
        🧠 QuizAI
      </Link>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/dashboard" style={{ fontSize: 14, color: "var(--text-muted)" }}>My Quizzes</Link>
          <Link to="/generate" style={{ fontSize: 14, color: "var(--text-muted)" }}>Generate</Link>
          <Link to="/history" style={{ fontSize: 14, color: "var(--text-muted)" }}>History</Link>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Hi, {user.name}</span>
          <button className="btn-outline" style={{ padding: "6px 14px" }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
