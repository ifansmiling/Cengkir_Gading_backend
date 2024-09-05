const fs = require("fs");
const path = require("path");
const DailyExercise = require("../models/DailyExerciseModel.js");

// Membuat data DailyExercise
exports.createDailyExercise = async (req, res) => {
  const { judul, deskripsi, tipe } = req.body;
  let filePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

  if (filePath) {
    filePath = filePath.replace(/^.*\/uploads/, "/uploads");
  }

  try {
    const dailyExercise = await DailyExercise.create({
      judul,
      deskripsi,
      file_path: filePath,
      tipe,
    });

    res.status(201).json(dailyExercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan semua data DailyExercise
exports.getDailyExercise = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const dailyExercises = await DailyExercise.findAll();

    const response = dailyExercises.map((exercise) => {
      return {
        ...exercise.dataValues,
        file_path: exercise.file_path
          ? `${baseUrl}${exercise.file_path}`
          : null,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan data DailyExercise berdasarkan ID
exports.getDailyExerciseById = async (req, res) => {
  try {
    const dailyExercise = await DailyExercise.findByPk(req.params.id);
    if (!dailyExercise)
      return res
        .status(404)
        .json({ message: "Daily Exercise tidak ditemukan" });
    res.status(200).json(dailyExercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update data DailyExercise
exports.updateDailyExercise = async (req, res) => {
  const { judul, deskripsi, tipe } = req.body;
  const filePath = req.file ? req.file.path : null;

  try {
    const dailyExercise = await DailyExercise.findByPk(req.params.id);
    if (!dailyExercise)
      return res
        .status(404)
        .json({ message: "Daily Exercise tidak ditemukan" });

    await dailyExercise.update({
      judul,
      deskripsi,
      file_path: filePath || dailyExercise.file_path,
      tipe,
    });
    res.status(200).json(dailyExercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menghapus data DailyExercise
exports.deleteDailyExercise = async (req, res) => {
  try {
    const dailyExercise = await DailyExercise.findByPk(req.params.id);
    if (!dailyExercise)
      return res
        .status(404)
        .json({ message: "Daily Exercise tidak ditemukan" });

    const filePath = dailyExercise.file_path;

    if (filePath) {
      const absolutePath = path.join(
        __dirname,
        "../uploads",
        filePath.replace(/^\/uploads\//, "")
      );
      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.error(`Gagal menghapus file ${absolutePath}: ${err.message}`);
          return res
            .status(500)
            .json({ message: `Gagal menghapus file: ${err.message}` });
        }
      });
    }

    await dailyExercise.destroy();
    res.status(200).json({ message: "Daily Exercise berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
