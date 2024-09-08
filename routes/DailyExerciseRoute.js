const express = require("express");
const uploadMultiple = require("../config/Multer.js"); // Menggunakan konfigurasi untuk multiple file
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
router.post("/daily-exercise", uploadMultiple, createDailyExercise);

// Rute Put
router.put("/daily-exercise/:id", uploadMultiple, updateDailyExercise);

// Rute Delete
router.delete("/daily-exercise/:id", deleteDailyExercise);

module.exports = router;
