const fs = require('fs');
const path = require('path');
const Skenario = require("../models/SkenarioModel.js");

// Membuat data skenario
exports.createSkenario = async (req, res) => {
  const { judul, deskripsi } = req.body;
  let filePath = req.file ? req.file.path.replace(/\\/g, "/") : null;
  if (filePath) {
    filePath = filePath.replace(/^.*\/uploads/, "/uploads");
  }

  try {
    const skenario = await Skenario.create({
      judul,
      deskripsi,
      file_path: filePath,
    });
    res.status(201).json(skenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan semua data skenario
exports.getSkenario = async (req, res) => {
  try {
    const skenarios = await Skenario.findAll();
    res.status(200).json(skenarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan data skenario berdasarkan ID
exports.getSkenarioById = async (req, res) => {
  try {
    const skenario = await Skenario.findByPk(req.params.id);
    if (!skenario)
      return res.status(404).json({ message: "Skenario tidak ditemukan" });
    res.status(200).json(skenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update data skenario
exports.updateSkenario = async (req, res) => {
  const { judul, deskripsi } = req.body;
  const filePath = req.file ? req.file.path : null;

  try {
    const skenario = await Skenario.findByPk(req.params.id);
    if (!skenario)
      return res.status(404).json({ message: "Skenario tidak ditemukan" });

    await skenario.update({
      judul,
      deskripsi,
      file_path: filePath || skenario.file_path,
    });
    res.status(200).json(skenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menghapus data skenario
exports.deleteSkenario = async (req, res) => {
  try {
    const skenario = await Skenario.findByPk(req.params.id);
    if (!skenario)
      return res.status(404).json({ message: "Skenario tidak ditemukan" });

    const filePath = skenario.file_path;

    if (filePath) {
      const absolutePath = path.join(__dirname, '../uploads', filePath.replace(/^\/uploads\//, ''));
      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.error(`Gagal menghapus file ${absolutePath}: ${err.message}`);
          return res.status(500).json({ message: `Gagal menghapus file: ${err.message}` });
        }
      });
    }

    await skenario.destroy();
    res.status(200).json({ message: "Skenario berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};