const fs = require("fs");
const path = require("path");
const KalenderAcara = require("../models/KalenderAcaraModel.js");

// Membuat data KalenderAcara
exports.createKalenderAcara = async (req, res) => {
  try {
    const { judul, deskripsi, tanggal_event } = req.body;

    let file_path = req.file ? req.file.path.replace(/\\/g, "/") : null;
    if (file_path) {
      file_path = file_path.replace(/^.*\/uploads/, "/uploads");
    }

    const newKalenderAcara = await KalenderAcara.create({
      judul,
      deskripsi,
      tanggal_event,
      file_path,
    });

    res.status(201).json(newKalenderAcara);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan semua data KalenderAcara
exports.getKalenderAcara = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const kalenderAcaras = await KalenderAcara.findAll();

    const response = kalenderAcaras.map((event) => {
      return {
        ...event.dataValues,
        file_path: event.file_path ? `${baseUrl}${event.file_path}` : null,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan data Kalender Acara berdakasarkan ID
exports.getKalenderAcaraById = async (req, res) => {
  try {
    const kalenderAcara = await KalenderAcara.findOne({
      where: { id: req.params.id },
    });
    if (!kalenderAcara)
      return res
        .status(404)
        .json({ message: "Kalender Acara tidak ditemukan" });
    res.status(200).json(kalenderAcara);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update data KalenderAcara
exports.updateKalenderAcara = async (req, res) => {
  try {
    const { judul, deskripsi, tanggal_event } = req.body;
    const kalenderAcara = await KalenderAcara.findOne({
      where: { id: req.params.id },
    });
    if (!kalenderAcara)
      return res
        .status(404)
        .json({ message: "Kalender Acara tidak ditemukan" });

    const file_path = req.file ? req.file.path : kalenderAcara.file_path;

    kalenderAcara.judul = judul;
    kalenderAcara.deskripsi = deskripsi;
    kalenderAcara.tanggal_event = tanggal_event;
    kalenderAcara.file_path = file_path;
    await kalenderAcara.save();

    res.status(200).json(kalenderAcara);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete KalenderAcara
exports.deleteKalenderAcara = async (req, res) => {
  try {
    const kalenderAcara = await KalenderAcara.findOne({
      where: { id: req.params.id },
    });

    if (!kalenderAcara)
      return res
        .status(404)
        .json({ message: "Kalender Acara tidak ditemukan" });

    const filePath = kalenderAcara.file_path;

    if (filePath) {
      const absolutePath = path.join(
        __dirname,
        "../uploads",
        filePath.replace(/^\/uploads\//, "")
      );
      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.error(`Gagal menghapus file ${absolutePath}: ${err.message}`);
        }
      });
    }

    await kalenderAcara.destroy();
    res.status(200).json({ message: "Kalender Acara berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
