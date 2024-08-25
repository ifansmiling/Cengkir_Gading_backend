const KalenderAcara = require("../models/KalenderAcaraModel.js");

// Membuat data KalenderAcara
exports.createKalenderAcara = async (req, res) => {
  try {
    const { judul, deskripsi, tanggal_event } = req.body;
    const file_path = req.file ? req.file.path : null; 
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
    const kalenderAcaras = await KalenderAcara.findAll();
    res.status(200).json(kalenderAcaras);
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
    if (!kalenderAcara) return res.status(404).json({ message: "Kalender Acara tidak ditemukan" });
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
    if (!kalenderAcara) return res.status(404).json({ message: "Kalender Acara tidak ditemukan" });

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
    if (!kalenderAcara) return res.status(404).json({ message: "Kalender Acara tidak ditemukan" });

    await kalenderAcara.destroy();
    res.status(200).json({ message: "Kalender Acara berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
