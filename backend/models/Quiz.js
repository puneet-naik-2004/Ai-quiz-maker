const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [arr => arr.length === 4, "Each question must have exactly 4 options"],
  },
  correctIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  explanation: {
    type: String,
    default: "",
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeLimitSeconds: {
      type: Number,
      default: 300, // 5 minutes
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
