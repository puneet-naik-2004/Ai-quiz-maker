import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div style={{ padding: "2rem" }}>No result data. <button onClick={() => navigate("/dashboard")}>Go home</button></div>;

  const { score, correctCount, totalQuestions, timeTakenSeconds, results } = state;
  const grade = score >= 80 ? "🏆 Excellent!" : score >= 60 ? "👍 Good job!" : score >= 40 ? "📚 Keep studying" : "😅 Try again";
  const gradeColor = score >= 80 ? "var(--success)" : score >= 60 ? "#f59e0b" : "var(--danger)";

  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      {/* Score card */}
      <div className="card" style={{ textAlign: "center", marginBottom: "1.5rem", padding: "2rem" }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: gradeColor, lineHeight: 1 }}>{score}%</div>
        <div style={{ fontSize: 22, marginTop: 8 }}>{grade}</div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 32, fontSize: 14, color: "var(--text-muted)" }}>
          <div><strong style={{ color: "var(--text)" }}>{correctCount}/{totalQuestions}</strong><br />Correct</div>
          <div><strong style={{ color: "var(--text)" }}>{formatTime(timeTakenSeconds)}</strong><br />Time taken</div>
        </div>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => navigate("/generate")}>Generate new quiz</button>
          <button className="btn-outline" onClick={() => navigate("/dashboard")}>My quizzes</button>
        </div>
      </div>

      {/* Question review */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1rem" }}>Review answers</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {results.map((r, i) => (
          <div
            key={i}
            className="card"
            style={{
              borderLeft: `4px solid ${r.isCorrect ? "var(--success)" : "var(--danger)"}`,
              paddingLeft: "1.25rem",
            }}
          >
            <p style={{ fontWeight: 500, marginBottom: 10, fontSize: 15 }}>
              {i + 1}. {r.prompt}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {r.options.map((opt, j) => {
                const isCorrect = j === r.correctIndex;
                const isSelected = j === r.selected;
                const bg = isCorrect ? "#d1fae5" : isSelected && !isCorrect ? "#fee2e2" : "transparent";
                const border = isCorrect ? "1px solid #6ee7b7" : isSelected ? "1px solid #fca5a5" : "1px solid transparent";
                return (
                  <div key={j} style={{ padding: "8px 12px", borderRadius: 6, background: bg, border, fontSize: 14 }}>
                    <span style={{ fontWeight: 600, marginRight: 8 }}>{["A", "B", "C", "D"][j]}.</span>
                    {opt}
                    {isCorrect && <span style={{ marginLeft: 8, color: "var(--success)", fontWeight: 600 }}>✓</span>}
                    {isSelected && !isCorrect && <span style={{ marginLeft: 8, color: "var(--danger)", fontWeight: 600 }}>✗ Your answer</span>}
                  </div>
                );
              })}
            </div>
            {r.explanation && (
              <div style={{ marginTop: 10, padding: "8px 12px", background: "#f0f9ff", borderRadius: 6, fontSize: 13, color: "#0369a1" }}>
                💡 {r.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
