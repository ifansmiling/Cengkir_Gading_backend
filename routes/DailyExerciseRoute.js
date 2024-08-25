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

//Rute Get
router.get("/daily-exercises", getDailyExercise);
router.get("/daily-exercises/:id", getDailyExerciseById);

//Rute Post
router.post("/daily-exercises", upload.single("file"), createDailyExercise);

//Rute Put
router.put("/daily-exercises/:id", upload.single("file"), updateDailyExercise);

//Rute Delete
router.delete("/daily-exercises/:id", deleteDailyExercise);

module.exports = router;
