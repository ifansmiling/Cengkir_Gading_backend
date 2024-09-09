const fs = require("fs");
const path = require("path");
const Skenario = require("../models/SkenarioModel.js");

// Membuat data skenario
exports.createSkenario = async (req, res) => {
  const { judul, deskripsi } = req.body;

  let filePaths = [];
  if (req.files && req.files.length > 0) {
    filePaths = req.files.map((file) =>
      file.path.replace(/\\/g, "/").replace(/^.*\/uploads/, "/uploads")
    );
  }

  if (filePaths.length === 0) {
    return res.status(400).json({ error: "File tidak boleh kosong" });
  }

  try {
    const skenario = await Skenario.create({
      judul,
      deskripsi,
      file_paths: JSON.stringify(filePaths),
    });
    res.status(201).json(skenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan semua data skenario
exports.getSkenario = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const skenarios = await Skenario.findAll();

    const response = skenarios.map((skenario) => {
      const filePathsArray = JSON.parse(skenario.file_paths);

      const fullFilePaths = filePathsArray.map(
        (filePath) => `${baseUrl}${filePath}`
      );

      return {
        ...skenario.dataValues,
        file_paths: fullFilePaths,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan data skenario berdasarkan ID
exports.getSkenarioById = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const skenario = await Skenario.findByPk(req.params.id);
    if (!skenario)
      return res.status(404).json({ message: "Skenario tidak ditemukan" });

    const filePathsArray = JSON.parse(skenario.file_paths);

    const fullFilePaths = filePathsArray.map(
      (filePath) => `${baseUrl}${filePath}`
    );

    res.status(200).json({
      ...skenario.dataValues,
      file_paths: fullFilePaths,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update data skenario
exports.updateSkenario = async (req, res) => {
  const { judul, deskripsi } = req.body;

  const newFilePaths = req.files
    ? req.files.map((file) =>
        file.path.replace(/\\/g, "/").replace(/^.*\/uploads/, "/uploads")
      )
    : [];

  try {
    const skenario = await Skenario.findByPk(req.params.id);
    if (!skenario) {
      return res.status(404).json({ message: "Skenario tidak ditemukan" });
    }

    const oldFilePathsArray = JSON.parse(skenario.file_paths || "[]");

    if (newFilePaths.length > 0) {
      oldFilePathsArray.forEach((filePath) => {
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

    await skenario.update({
      judul,
      deskripsi,
      file_paths: JSON.stringify(
        newFilePaths.length > 0 ? newFilePaths : oldFilePathsArray
      ),
    });

    res.status(200).json(skenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSkenario = async (req, res) => {
  try {
    const skenario = await Skenario.findByPk(req.params.id);
    if (!skenario) {
      return res.status(404).json({ message: "Skenario tidak ditemukan" });
    }

    const filePathsArray = JSON.parse(skenario.file_paths);

    filePathsArray.forEach((filePath) => {
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
    });

    await skenario.destroy();

    res.status(200).json({ message: "Skenario berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
