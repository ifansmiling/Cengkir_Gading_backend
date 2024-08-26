const express = require("express");
const upload = require("../config/Multer.js");
const {
  createDailyExercise,
  getDailyExercise,
  getDailyExerciseById,
  updateDailyExercise,
  deleteDailyExercise,
} = require("../controllers/DailyExerciseController.js");

const router = express.Router();

// Rute Get
router.get("/daily-exercise", getDailyExercise);
router.get("/daily-exercise/:id", getDailyExerciseById);

// Rute Post
router.post("/daily-exercise", upload.single("file"), createDailyExercise);

// Rute Put
router.put("/daily-exercise/:id", upload.single("file"), updateDailyExercise);

// Rute Delete
router.delete("/daily-exercise/:id", deleteDailyExercise);

module.exports = router;
