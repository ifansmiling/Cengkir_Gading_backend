const fs = require("fs");
const path = require("path");
const KalenderAcara = require("../models/KalenderAcaraModel.js");

// Membuat data KalenderAcara
exports.createKalenderAcara = async (req, res) => {
  try {
    const { judul, deskripsi, tanggal_event } = req.body;

    let file_paths = [];
    if (req.files && req.files.length > 0) {
      file_paths = req.files.map((file) =>
        file.path.replace(/\\/g, "/").replace(/^.*\/uploads/, "/uploads")
      );
    }

    const file_paths_string = file_paths.join(",");

    const newKalenderAcara = await KalenderAcara.create({
      judul,
      deskripsi,
      tanggal_event,
      file_paths: file_paths_string,
    });

    res.status(201).json(newKalenderAcara);
  } catch (error) {
    console.error("Error creating KalenderAcara:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan semua data KalenderAcara
exports.getKalenderAcara = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const kalenderAcaras = await KalenderAcara.findAll();

    const response = kalenderAcaras.map((event) => {
      const file_paths_array = event.file_paths
        ? event.file_paths.split(",")
        : [];
      return {
        ...event.dataValues,
        file_paths: file_paths_array.map((filePath) => {
          return `${baseUrl}${filePath.replace(/"/g, "")}`;
        }),
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan data KalenderAcara berdasarkan ID
exports.getKalenderAcaraById = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const kalenderAcara = await KalenderAcara.findOne({
      where: { id: req.params.id },
    });

    if (!kalenderAcara)
      return res
        .status(404)
        .json({ message: "Kalender Acara tidak ditemukan" });

    console.log("Kalender Acara:", kalenderAcara);

    let file_paths_array;
    if (Array.isArray(kalenderAcara.file_paths)) {
      file_paths_array = kalenderAcara.file_paths.map((filePath) => {
        return `${baseUrl}${filePath.replace(/"/g, "").replace(/\\/g, "/")}`;
      });
    } else if (typeof kalenderAcara.file_paths === "string") {
      file_paths_array = kalenderAcara.file_paths.split(",").map((filePath) => {
        return `${baseUrl}${filePath.replace(/"/g, "").replace(/\\/g, "/")}`;
      });
    } else {
      file_paths_array = [];
    }

    console.log("File Paths Array:", file_paths_array);

    res.status(200).json({
      ...kalenderAcara.dataValues,
      file_paths: file_paths_array,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update data KalenderAcara
exports.updateKalenderAcara = async (req, res) => {
  try {
    const { judul, deskripsi, tanggal_event } = req.body;

    console.log("Request body:", req.body);
    console.log("Files:", req.files);

    const kalenderAcara = await KalenderAcara.findOne({
      where: { id: req.params.id },
    });

    if (!kalenderAcara)
      return res
        .status(404)
        .json({ message: "Kalender Acara tidak ditemukan" });

    if (kalenderAcara.file_paths) {
      const oldFilePaths = kalenderAcara.file_paths.split(",");
      oldFilePaths.forEach((filePath) => {
        const fullPath = path.join(
          __dirname,
          "..",
          "uploads",
          filePath.replace(/^\/uploads\//, "")
        );
        console.log("Deleting file:", fullPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    let file_paths = [];
    if (req.files && req.files.length > 0) {
      file_paths = req.files.map((file) =>
        file.path.replace(/\\/g, "/").replace(/^.*\/uploads/, "/uploads")
      );
    }

    kalenderAcara.judul = judul;
    kalenderAcara.deskripsi = deskripsi;
    kalenderAcara.tanggal_event = tanggal_event;
    kalenderAcara.file_paths = file_paths.join(",");
    await kalenderAcara.save();

    res.status(200).json(kalenderAcara);
  } catch (error) {
    console.error("Error updating Kalender Acara:", error);
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

    if (kalenderAcara.file_paths && kalenderAcara.file_paths.length > 0) {
      const file_paths_array = kalenderAcara.file_paths.split(",");
      file_paths_array.forEach((filePath) => {
        const absolutePath = path.join(
          __dirname,
          "../uploads",
          filePath.replace(/^\/uploads\//, "")
        );
        fs.unlink(absolutePath, (err) => {
          if (err) {
            console.error(
              `Gagal menghapus file ${absolutePath}: ${err.message}`
            );
          }
        });
      });
    }

    await kalenderAcara.destroy();
    res.status(200).json({ message: "Kalender Acara berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
