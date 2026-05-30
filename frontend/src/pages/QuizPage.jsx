import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    api.get(`/quiz/${id}`).then(({ data }) => {
      setQuiz(data);
      setAnswers(new Array(data.questions.length).fill(-1));
      setTimeLeft(data.timeLimitSeconds);
    });
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) handleSubmit();
  }, [timeLeft]);

  const handleAnswer = (idx) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    try {
      const { data } = await api.post("/attempt", {
        quizId: quiz._id,
        answers,
        timeTakenSeconds: timeTaken,
      });
      navigate("/result", { state: data });
    } catch (err) {
      alert("Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!quiz) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading quiz...</div>;

  const q = quiz.questions[current];
  const answered = answers.filter(a => a !== -1).length;
  const timerColor = timeLeft < 60 ? "var(--danger)" : "var(--text)";

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 600 }}>{quiz.title}</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {answered} / {quiz.questions.length} answered
          </p>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: timerColor, fontVariantNumeric: "tabular-nums" }}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: "var(--border)", borderRadius: 4, marginBottom: "1.5rem" }}>
        <div style={{ height: "100%", background: "var(--primary)", borderRadius: 4, width: `${((current + 1) / quiz.questions.length) * 100}%`, transition: "width 0.3s" }} />
      </div>

      {/* Question card */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
          Question {current + 1} of {quiz.questions.length}
        </p>
        <p style={{ fontSize: 17, fontWeight: 500, marginBottom: "1.5rem", lineHeight: 1.5 }}>{q.prompt}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              style={{
                textAlign: "left",
                padding: "12px 16px",
                border: `2px solid ${answers[current] === i ? "var(--primary)" : "var(--border)"}`,
                background: answers[current] === i ? "#eef2ff" : "#fff",
                color: "var(--text)",
                borderRadius: 8,
                fontWeight: answers[current] === i ? 500 : 400,
                transition: "all 0.15s",
              }}
            >
              <span style={{ marginRight: 10, color: "var(--primary)", fontWeight: 600 }}>
                {["A", "B", "C", "D"][i]}.
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn-outline" onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>
          ← Prev
        </button>

        <div style={{ display: "flex", gap: 6 }}>
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: i === current ? "var(--primary)" : answers[i] !== -1 ? "#c7d2fe" : "var(--border)",
                color: i === current ? "#fff" : "var(--text)",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {current < quiz.questions.length - 1 ? (
          <button className="btn-primary" onClick={() => setCurrent(c => c + 1)}>Next →</button>
        ) : (
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting} style={{ background: "var(--success)" }}>
            {submitting ? "Submitting..." : "Submit quiz ✓"}
          </button>
        )}
      </div>
    </div>
  );
}
