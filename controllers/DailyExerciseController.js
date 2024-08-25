const DailyExercise = require("../models/DailyExerciseModel.js");

// Membuat data DailyExercise
exports.createDailyExercise = async (req, res) => {
  const { judul, deskripsi, tipe } = req.body;
  const filePath = req.file ? req.file.path : null;
  
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
    const dailyExercises = await DailyExercise.findAll();
    res.status(200).json(dailyExercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan data DailyExercise berdasarkan ID
exports.getDailyExerciseById = async (req, res) => {
  try {
    const dailyExercise = await DailyExercise.findByPk(req.params.id);
    if (!dailyExercise) return res.status(404).json({ message: "Daily Exercise tidak ditemukan" });
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
    if (!dailyExercise) return res.status(404).json({ message: "Daily Exercise tidak ditemukan" });

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
    if (!dailyExercise) return res.status(404).json({ message: "Daily Exercise tidak ditemukan" });

    await dailyExercise.destroy();
    res.status(200).json({ message: "Daily Exercise berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
