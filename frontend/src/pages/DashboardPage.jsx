import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const diffColors = {
  easy: { bg: "#d1fae5", color: "#065f46" },
  medium: { bg: "#fef3c7", color: "#92400e" },
  hard: { bg: "#fee2e2", color: "#991b1b" },
};

export default function DashboardPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/quiz").then(({ data }) => setQuizzes(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this quiz?")) return;
    await api.delete(`/quiz/${id}`);
    setQuizzes(prev => prev.filter(q => q._id !== id));
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>My quizzes</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} generated</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/generate")}>+ Generate new</button>
      </div>

      {quizzes.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No quizzes yet</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: 14 }}>Generate your first quiz from any topic or notes.</p>
          <Link to="/generate"><button className="btn-primary">Generate a quiz</button></Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {quizzes.map((q) => (
            <div key={q._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{q.title}</h3>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                    ...diffColors[q.difficulty]
                  }}>{q.difficulty}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {q.questionCount} questions · {Math.floor(q.timeLimitSeconds / 60)} min · {new Date(q.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-primary" style={{ padding: "8px 16px" }} onClick={() => navigate(`/quiz/${q._id}`)}>
                  Start
                </button>
                <button className="btn-danger" style={{ padding: "8px 16px" }} onClick={() => handleDelete(q._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
