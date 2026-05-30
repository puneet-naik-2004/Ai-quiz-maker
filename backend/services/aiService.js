const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateQuizQuestions = async (topic, count = 5, difficulty = "medium") => {
  const prompt = `You are an expert quiz creator. Generate exactly ${count} multiple-choice questions about:
"""
${topic}
"""
Difficulty: ${difficulty}

Rules:
- Each question must have exactly 4 answer options.
- Only one option is correct.
- Include a brief explanation for the correct answer.
- Questions should test genuine understanding.

Respond ONLY with a valid JSON array. No markdown, no extra text. Format:
[
  {
    "prompt": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of the correct answer."
  }
]`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const raw = response.choices[0].message.content.trim();
  const clean = raw.replace(/```json|```/g, "").trim();
  const questions = JSON.parse(clean);

  if (!Array.isArray(questions)) throw new Error("AI did not return a valid array");
  console.log(`Successfully generated ${questions.length} questions using Groq`);
  return questions;
};

module.exports = { generateQuizQuestions };