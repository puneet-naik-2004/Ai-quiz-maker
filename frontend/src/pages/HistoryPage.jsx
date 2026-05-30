import { useState, useEffect } from "react";
import api from "../utils/api";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/attempt/history").then(({ data }) => setHistory(data)).finally(() => setLoading(false));
  }, []);

  const scoreColor = (s) => s >= 80 ? "var(--success)" : s >= 60 ? "#f59e0b" : "var(--danger)";
  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: "1.5rem" }}>Attempt history</h1>

      {history.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)" }}>No attempts yet. Take a quiz first!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {history.map((a) => (
            <div key={a._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{a.quizId?.title || "Deleted quiz"}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                  {a.quizId?.topic} · {new Date(a.createdAt).toLocaleDateString()} · {formatTime(a.timeTakenSeconds)}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: scoreColor(a.score) }}>{a.score}%</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.correctCount} correct</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
