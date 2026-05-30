const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");

// @route   POST /api/attempt
// @access  Private
const submitAttempt = async (req, res) => {
  const { quizId, answers, timeTakenSeconds } = req.body;

  if (!quizId || !Array.isArray(answers))
    return res.status(400).json({ message: "quizId and answers are required" });

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (answers.length !== quiz.questions.length)
      return res.status(400).json({ message: "Answer count does not match question count" });

    // Score the attempt
    let correctCount = 0;
    const results = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        prompt: q.prompt,
        options: q.options,
        selected: answers[i],
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        isCorrect,
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);

    const attempt = await Attempt.create({
      quizId,
      userId: req.user._id,
      answers,
      score,
      correctCount,
      timeTakenSeconds: timeTakenSeconds || 0,
    });

    res.status(201).json({
      attemptId: attempt._id,
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      timeTakenSeconds: attempt.timeTakenSeconds,
      results, // includes explanations for the score screen
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/attempt/history
// @access  Private
const getAttemptHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id })
      .populate("quizId", "title topic difficulty")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitAttempt, getAttemptHistory };
