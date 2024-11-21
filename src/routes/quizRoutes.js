const express = require("express");
const { startQuiz, submitQuiz } = require("../controllers/quizController");
const { logoutUser } = require("../controllers/authController");
const { submitQuestion } = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const Mathematic = require("../models/Question");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const quizMiddleware = require("../middleware/authMiddleware");
router.post("/question", submitQuestion);

router.get("/question", async (req, res) => {
  try {
    const questions = await Mathematic.find();
    res.status(200).send(questions);
  } catch (e) {
    res.status(400).send("coudn't get the questions data!!");
  }
});

router.get("/takequiz", authMiddleware, async (req, res) => {
  res.render("home", {
    isAuthenticated: true,
    categories: [
      {
        name: "Physics",
        icon: "https://img.icons8.com/color/96/physics.png",
        link: "http://localhost:4002/quiz/physics",
      },
      {
        name: "Geography",
        icon: "https://img.icons8.com/color/96/world-map.png",
        link: "http://localhost:4002/quiz/geography",
      },
      {
        name: "Math",
        icon: "https://img.icons8.com/color/96/math.png",
        link: "http://localhost:4002/quiz/mathematics",
      },
      {
        name: "Language",
        icon: "https://img.icons8.com/color/96/language.png",
        link: "http://localhost:4002/quiz/language",
      },
      {
        name: "Astronomy",
        icon: "https://img.icons8.com/color/96/telescope.png",
        link: "http://localhost:4002/quiz/astronomy",
      },
    ],
  });
});
router.get("/:subject", authMiddleware, async (req, res) => {
  const subject = req.params.subject; // Extract category from the URL
  try {
    // Fetch questions for the given subject from MongoDB
    const quizData = await Mathematic.findOne({ subject }); // Use findOne() to get a single quiz by subject

    if (quizData && quizData.questions) {
      console.log("Fetched questions:", quizData.questions);
      res.render("questions", {
        subject,
        questions: quizData.questions, // Pass the questions to the template
      });
    } else {
      res.status(404).send("Questions not found for the specified subject.");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).send("Failed to load quiz questions.");
  }
});
router.get("/dashboard/score", authMiddleware, async (req, res) => {
  try {
    res.render("dashboard");
  } catch (error) {}
});
router.post("/start", authMiddleware, startQuiz);
router.post("/submit", authMiddleware, submitQuiz);
module.exports = router;
