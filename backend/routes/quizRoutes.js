const express = require("express");
const {
  generateQuiz,
  getMyQuizzes,
  getQuizById,
  deleteQuiz,
} = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // All quiz routes require auth

router.post("/generate", generateQuiz);
router.get("/", getMyQuizzes);
router.get("/:id", getQuizById);
router.delete("/:id", deleteQuiz);

module.exports = router;
