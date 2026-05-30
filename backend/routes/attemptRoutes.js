const express = require("express");
const { submitAttempt, getAttemptHistory } = require("../controllers/attemptController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", submitAttempt);
router.get("/history", getAttemptHistory);

module.exports = router;
