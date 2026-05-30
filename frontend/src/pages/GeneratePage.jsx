import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function GeneratePage() {
  const [form, setForm] = useState({
    topic: "",
    count: 5,
    difficulty: "medium",
    timeLimitSeconds: 300,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/quiz/generate", form);
      navigate(`/quiz/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Generate a quiz</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: 14 }}>
        Paste your notes, a topic name, or a paragraph — the AI will create quiz questions for you.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Topic or notes *
            </label>
            <textarea
              rows={6}
              placeholder="e.g. 'The water cycle and precipitation' or paste your study notes here..."
              value={form.topic}
              onChange={e => setForm({ ...form, topic: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Questions</label>
              <select value={form.count} onChange={e => setForm({ ...form, count: Number(e.target.value) })}>
                {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Time limit</label>
              <select value={form.timeLimitSeconds} onChange={e => setForm({ ...form, timeLimitSeconds: Number(e.target.value) })}>
                <option value={120}>2 min</option>
                <option value={300}>5 min</option>
                <option value={600}>10 min</option>
                <option value={900}>15 min</option>
              </select>
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: "flex-start", padding: "12px 28px" }}>
            {loading ? "🤖 Generating questions..." : "✨ Generate quiz"}
          </button>
        </form>
      </div>
    </div>
  );
}
