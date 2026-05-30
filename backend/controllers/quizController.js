const Quiz = require("../models/Quiz");
const { generateQuizQuestions } = require("../services/aiService");

// @route   POST /api/quiz/generate
// @access  Private
const generateQuiz = async (req, res) => {
  const { topic, count = 5, difficulty = "medium", timeLimitSeconds = 300 } = req.body;

  if (!topic || topic.trim().length < 3)
    return res.status(400).json({ message: "Please provide a valid topic or notes" });

  try {
    const questions = await generateQuizQuestions(topic, count, difficulty);

    // Derive a short title from the topic
    const title =
      topic.length > 60
        ? topic.substring(0, 57).trim() + "..."
        : topic.trim();

    const quiz = await Quiz.create({
      title,
      topic,
      difficulty,
      questions,
      timeLimitSeconds,
      createdBy: req.user._id,
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Quiz generation error:", error.message);
    res.status(500).json({ message: "Failed to generate quiz. Try again." });
  }
};

// @route   GET /api/quiz
// @access  Private
const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .select("title topic difficulty timeLimitSeconds createdAt questions")
      .sort({ createdAt: -1 });

    // Return count instead of full questions for the list view
    const result = quizzes.map((q) => ({
      _id: q._id,
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      timeLimitSeconds: q.timeLimitSeconds,
      questionCount: q.questions.length,
      createdAt: q.createdAt,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/quiz/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Only the creator can view the quiz with answers
    if (quiz.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorised" });

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/quiz/:id
// @access  Private
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorised" });

    await quiz.deleteOne();
    res.json({ message: "Quiz deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQuiz, getMyQuizzes, getQuizById, deleteQuiz };
